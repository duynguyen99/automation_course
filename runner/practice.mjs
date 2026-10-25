// "Tiệm Trà Mộc": the practice website Selenium lessons automate, plus a small JSON API
// for the REST Assured chapter. Static pages live in runner/practice/.
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "practice");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

export const PRODUCTS = [
  { id: 1, name: "Trà Shan Tuyết", category: "tra-xanh", price: 185000, stock: 12 },
  { id: 2, name: "Trà Ô Long Lâm Đồng", category: "o-long", price: 240000, stock: 8 },
  { id: 3, name: "Trà Sen Tây Hồ", category: "tra-uop", price: 420000, stock: 3 },
  { id: 4, name: "Trà Nhài Thái Nguyên", category: "tra-uop", price: 150000, stock: 20 },
  { id: 5, name: "Hồng Trà Hà Giang", category: "hong-tra", price: 210000, stock: 0 },
  { id: 6, name: "Ấm Tử Sa Mini", category: "dung-cu", price: 560000, stock: 5 },
];

const USERS = { lan: { password: "matkhau123", name: "Lan", locked: false }, khoa: { password: "matkhau123", name: "Khoa", locked: true } };
const tokens = new Map(); // token -> username
const orders = [];

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > 20_000) throw Object.assign(new Error("Body quá lớn"), { status: 413 });
    chunks.push(c);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return null;
  }
}

async function handleApi(req, res, path) {
  const auth = /^Bearer (.+)$/.exec(req.headers.authorization ?? "")?.[1];
  const user = auth ? tokens.get(auth) : undefined;

  if (req.method === "GET" && path === "/products") {
    return json(res, 200, PRODUCTS);
  }
  const productMatch = /^\/products\/(\d+)$/.exec(path);
  if (req.method === "GET" && productMatch) {
    const product = PRODUCTS.find((p) => p.id === Number(productMatch[1]));
    return product ? json(res, 200, product) : json(res, 404, { error: "Không tìm thấy sản phẩm" });
  }
  if (req.method === "POST" && path === "/login") {
    const body = await readJson(req);
    const account = USERS[body?.username];
    if (!account || account.password !== body?.password) return json(res, 401, { error: "Sai tài khoản hoặc mật khẩu" });
    if (account.locked) return json(res, 403, { error: "Tài khoản đã bị khóa" });
    const token = `tok_${Math.random().toString(36).slice(2, 12)}`;
    tokens.set(token, body.username);
    return json(res, 200, { token, name: account.name });
  }
  if (path === "/orders") {
    if (!user) return json(res, 401, { error: "Cần đăng nhập" });
    if (req.method === "GET") return json(res, 200, orders.filter((o) => o.user === user));
    if (req.method === "POST") {
      const body = await readJson(req);
      const product = PRODUCTS.find((p) => p.id === body?.productId);
      const quantity = Number(body?.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1) return json(res, 400, { error: "productId hoặc quantity không hợp lệ" });
      if (quantity > product.stock) return json(res, 409, { error: "Không đủ hàng" });
      const order = { id: orders.length + 1001, user, productId: product.id, quantity, total: product.price * quantity, status: "MOI" };
      orders.push(order);
      return json(res, 201, order);
    }
  }
  return json(res, 404, { error: "Không có API này" });
}

/** Serves /practice/* (static site) and /practice/api/*. Returns false if not a practice URL. */
export async function handlePractice(req, res, url) {
  if (!url.pathname.startsWith("/practice")) return false;
  if (url.pathname.startsWith("/practice/api/")) {
    await handleApi(req, res, url.pathname.slice("/practice/api".length));
    return true;
  }
  if (req.method !== "GET") return false;

  let rel = decodeURIComponent(url.pathname.slice("/practice".length)) || "/";
  if (rel.endsWith("/")) rel += "index.html";
  const file = normalize(join(ROOT, rel));
  if (!file.startsWith(ROOT + sep)) return false; // path traversal
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", "cache-control": "no-cache" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end("<h1>404</h1><p>Trang không tồn tại. <a href='/practice/'>Về trang chủ</a></p>");
  }
  return true;
}
