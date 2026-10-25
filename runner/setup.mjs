// Downloads the Java libraries learner code can use (JUnit, AssertJ, Selenium, Cucumber...)
// into runner/lib/jars. Uses Maven from PATH, or fetches a private copy into runner/.tools.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAVEN_VERSION = "3.9.16";
const root = dirname(fileURLToPath(import.meta.url));
const toolsDir = join(root, ".tools");
const jarsDir = join(root, "lib", "jars");
const isWin = process.platform === "win32";

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: isWin, ...opts });
  if (res.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed (exit ${res.status})`);
}

function hasCommand(cmd) {
  return spawnSync(cmd, ["-v"], { stdio: "ignore", shell: isWin }).status === 0;
}

async function ensureMaven() {
  if (hasCommand("mvn")) return "mvn";
  const home = join(toolsDir, `apache-maven-${MAVEN_VERSION}`);
  const bin = join(home, "bin", isWin ? "mvn.cmd" : "mvn");
  if (existsSync(bin)) return bin;

  mkdirSync(toolsDir, { recursive: true });
  const url = `https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/${MAVEN_VERSION}/apache-maven-${MAVEN_VERSION}-bin.zip`;
  console.log(`[setup] downloading Maven ${MAVEN_VERSION}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Maven download failed: HTTP ${res.status}`);
  const zip = join(toolsDir, "maven.zip");
  writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  // Windows 10+ ships bsdtar, which reads zip. Call it by path: Git Bash's GNU tar can't.
  const tar = isWin ? join(process.env.SystemRoot ?? "C:\\Windows", "System32", "tar.exe") : "unzip";
  run(tar, isWin ? ["-xf", "maven.zip"] : ["-q", "maven.zip"], { shell: false, cwd: toolsDir });
  rmSync(zip);
  return bin;
}

const mvn = await ensureMaven();
rmSync(jarsDir, { recursive: true, force: true });
console.log("[setup] resolving Java libraries...");
run(mvn, [
  "-q", "-B",
  "-f", join(root, "lib", "pom.xml"),
  "dependency:copy-dependencies",
  `-DoutputDirectory=${jarsDir}`,
  "-DincludeScope=runtime",
]);
console.log(`[setup] done: libraries are in ${jarsDir}`);
