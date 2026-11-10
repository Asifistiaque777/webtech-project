// ===== Shared data + helper functions (used by every page) =====
// We use localStorage as a simple "database" (it keeps data inside the browser).

const DELIVERY_CHARGE = 50;

// Shown when an online image link does not load
const NO_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' font-size='22' text-anchor='middle' fill='%236b7280'>No Image</text></svg>";

// Demo items (hard-coded, images are online links)
const DEFAULT_ITEMS = [
  { id: 1, name: "Beef Burger", category: "Food", price: 250, inStock: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 2, name: "Chicken Pizza", category: "Food", price: 450, inStock: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80" },
  { id: 3, name: "Chicken Biryani", category: "Food", price: 220, inStock: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
  { id: 4, name: "Fried Chicken (4 pcs)", category: "Food", price: 320, inStock: true,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80" },
  { id: 5, name: "French Fries", category: "Food", price: 120, inStock: true,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80" },
  { id: 6, name: "Chicken Sandwich", category: "Food", price: 180, inStock: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80" },
  { id: 7, name: "Fried Noodles", category: "Food", price: 160, inStock: false,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80" },
  { id: 8, name: "Cold Drink", category: "Food", price: 50, inStock: true,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },

  { id: 9, name: "Document Envelope", category: "Parcel", price: 60, inStock: true,
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80" },
  { id: 10, name: "Small Parcel (up to 1 kg)", category: "Parcel", price: 100, inStock: true,
    image: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=400&q=80" },
  { id: 11, name: "Medium Parcel (up to 5 kg)", category: "Parcel", price: 180, inStock: true,
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80" },
  { id: 12, name: "Large Parcel (up to 10 kg)", category: "Parcel", price: 300, inStock: true,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80" }
];

// ----- Items -----
function getItems() {
  let items = JSON.parse(localStorage.getItem("items"));
  if (items === null) {            // first time: save the demo items
    items = DEFAULT_ITEMS;
    saveItems(items);
  }
  return items;
}

function saveItems(items) {
  localStorage.setItem("items", JSON.stringify(items));
}

function findItem(id) {
  return getItems().find(function (item) { return item.id === id; });
}

// ----- Cart (list of { id, qty }) -----
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Returns names of cart items that the admin has marked "out of stock"
function getOutOfStockNames() {
  const names = [];
  for (const c of getCart()) {
    const item = findItem(c.id);
    if (!item.inStock) {
      names.push(item.name);
    }
  }
  return names;
}

// ----- Orders -----
function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

// ----- Small helpers -----
function imgError(img) {
  img.onerror = null;              // stop looping if the placeholder fails too
  img.src = NO_IMAGE;
}

// Makes customer text safe before showing it inside HTML
function safe(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ----- Riders (demo only: hard-coded accounts) -----
const RIDERS = [
  { id: "r1", name: "Rahim Uddin",   email: "rahim@rider.com", password: "rider123" },
  { id: "r2", name: "Karim Hossain", email: "karim@rider.com", password: "rider123" },
  { id: "r3", name: "Sumon Ali",     email: "sumon@rider.com", password: "rider123" }
];

// Order status flow:  Pending -> Accepted -> Picked Up -> Delivered
// Badge colour for each status (used by the admin and the rider panel)
function statusClass(status) {
  if (status === "Delivered") return "success";
  if (status === "Picked Up") return "purple";
  if (status === "Accepted") return "info";
  return "warning";                               // Pending
}

// One small number card ("Completed: 5") used on admin + rider panels
function statCard(title, number) {
  return '<div class="card"><h4>' + title + '</h4><p class="number">' + number + '</p></div>';
}
