// Shared header + cart helpers for the practice site. The cart lives in localStorage.
const PRODUCTS = [
  { id: 1, name: "Trà Shan Tuyết", category: "tra-xanh", price: 185000, stock: 12, icon: "🍃" },
  { id: 2, name: "Trà Ô Long Lâm Đồng", category: "o-long", price: 240000, stock: 8, icon: "🌿" },
  { id: 3, name: "Trà Sen Tây Hồ", category: "tra-uop", price: 420000, stock: 3, icon: "🪷" },
  { id: 4, name: "Trà Nhài Thái Nguyên", category: "tra-uop", price: 150000, stock: 20, icon: "🌼" },
  { id: 5, name: "Hồng Trà Hà Giang", category: "hong-tra", price: 210000, stock: 0, icon: "🍂" },
  { id: 6, name: "Ấm Tử Sa Mini", category: "dung-cu", price: 560000, stock: 5, icon: "🫖" },
];

function formatPrice(n) {
  return n.toLocaleString("vi-VN") + "₫";
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartCount();
}

function addToCart(id) {
  const cart = getCart();
  const line = cart.find((l) => l.id === id);
  if (line) line.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
}

function renderCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = getCart().reduce((s, l) => s + l.qty, 0);
}

function toast(text) {
  const t = document.createElement("div");
  t.className = "toast";
  t.id = "toast";
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function renderHeader() {
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="logo" href="/practice/">🍵 Tiệm Trà Mộc</a>
    <nav>
      <a href="/practice/products.html">Sản phẩm</a>
      <a href="/practice/login.html" id="nav-login">Đăng nhập</a>
      <a href="/practice/checkout.html">Thanh toán</a>
    </nav>
    <a class="cart-link" href="/practice/cart.html" id="cart-link">Giỏ hàng <span id="cart-count">0</span></a>`;
  document.body.prepend(header);
  renderCartCount();
}

document.addEventListener("DOMContentLoaded", renderHeader);
