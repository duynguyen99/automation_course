// Live browser view. ChromeDriver starts Chrome with a user-data-dir inside TEMP; since each
// run gets its own TEMP, we find Chrome's DevToolsActivePort file there, attach over CDP
// and stream screencast frames. Learner code stays a plain `new ChromeDriver()`.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const POLL_MS = 250;

async function findDevToolsPort(tmpDir) {
  let entries;
  try {
    entries = await readdir(tmpDir, { withFileTypes: true });
  } catch {
    return null;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      const text = await readFile(join(tmpDir, entry.name, "DevToolsActivePort"), "utf8");
      const port = Number(text.split(/\r?\n/)[0]);
      if (port > 0) return port;
    } catch {
      // not a Chrome profile dir (yet)
    }
  }
  return null;
}

async function pageTarget(port) {
  const res = await fetch(`http://127.0.0.1:${port}/json/list`);
  const targets = await res.json();
  return targets.find((t) => t.type === "page" && t.webSocketDebuggerUrl) ?? null;
}

/**
 * Watches a run's temp dir for Chrome and calls onFrame(base64Jpeg) while it renders.
 * Returns stop(): resolves with the last frame (or null).
 */
export function watchBrowser(tmpDir, onFrame) {
  let stopped = false;
  let socket = null;
  let attachedTo = null;
  let lastFrame = null;
  let nextId = 1;

  const attach = (target) => {
    socket?.close();
    attachedTo = target.id;
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    socket = ws;
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({
        id: nextId++,
        method: "Page.startScreencast",
        params: { format: "jpeg", quality: 60, maxWidth: 1100, maxHeight: 720, everyNthFrame: 1 },
      }));
    });
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(String(event.data));
      if (msg.method !== "Page.screencastFrame") return;
      ws.send(JSON.stringify({ id: nextId++, method: "Page.screencastFrameAck", params: { sessionId: msg.params.sessionId } }));
      lastFrame = msg.params.data;
      onFrame(lastFrame);
    });
    ws.addEventListener("close", () => {
      if (socket === ws) attachedTo = null;
    });
    ws.addEventListener("error", () => {});
  };

  const loop = async () => {
    let port = null;
    while (!stopped) {
      try {
        port ??= await findDevToolsPort(tmpDir);
        if (port) {
          // Follow the newest page so switching windows/tabs keeps the view live.
          const target = await pageTarget(port);
          if (target && target.id !== attachedTo) attach(target);
        }
      } catch {
        // browser closed or not ready; keep polling until the run ends
      }
      await new Promise((r) => setTimeout(r, port ? POLL_MS * 4 : POLL_MS));
    }
  };
  loop();

  return async () => {
    stopped = true;
    socket?.close();
    return lastFrame;
  };
}
