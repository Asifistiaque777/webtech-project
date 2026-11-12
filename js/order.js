// ===== Order page: show items + manage the cart =====

// Make the HTML for one item card
function makeCard(item) {
  let button;
  if (item.inStock) {
    button = '<button class="btn" onclick="addToCart(' + item.id + ')">Add to Cart</button>';
  } else {
    button = '<button class="btn btn-disabled" disabled>Out of Stock</button>';
  }

  return '<div class="product">' +
           '<img src="' + item.image + '" alt="' + item.name + '" onerror="imgError(this)">' +
           '<div class="product-info">' +
             '<h4>' + item.name + '</h4>' +
             '<p class="price">৳' + item.price + '</p>' +
             button +
           '</div>' +
         '</div>';
}

// Search and category must both match. Filtering never changes the saved items.
function showItems() {
  const items = getItems();
  const search = document.getElementById("item-search").value.trim().toLowerCase();
  const category = document.getElementById("category-filter").value;
  let foodHtml = "";
  let parcelHtml = "";
  let count = 0;

  for (const item of items) {
    const matchesName = item.name.toLowerCase().includes(search);
    const matchesCategory = category === "All" || item.category === category;
    if (!matchesName || !matchesCategory) {
      continue;
    }

    count++;
    if (item.category === "Food") {
      foodHtml += makeCard(item);
    } else {
      parcelHtml += makeCard(item);
    }
  }

  document.getElementById("food-list").innerHTML = foodHtml;
  document.getElementById("parcel-list").innerHTML = parcelHtml;
  document.getElementById("food-section").hidden = foodHtml === "";
  document.getElementById("parcel-section").hidden = parcelHtml === "";
  document.getElementById("no-results").hidden = count !== 0;
  document.getElementById("results-count").textContent =
    "Showing " + count + " of " + items.length + " items";
}

function resetFilters() {
  document.getElementById("item-search").value = "";
  document.getElementById("category-filter").value = "All";
  showItems();
  document.getElementById("item-search").focus();
}

// ----- Cart functions -----
function addToCart(id) {
  // Stock may have changed in the admin page since this card was displayed.
  const item = findItem(id);
  if (!item || !item.inStock) {
    alert("This item is no longer available.");
    showItems();
    showCart();
    return;
  }

  const cart = getCart();
  const found = cart.find(function (c) { return c.id === id; });

  if (found) {
    found.qty += 1;
  } else {
    cart.push({ id: id, qty: 1 });
  }

  saveCart(cart);
  showCart();
}

function changeQty(id, change) {
  let cart = getCart();
  const found = cart.find(function (c) { return c.id === id; });
  if (!found) return;

  const item = findItem(id);
  if (change > 0 && (!item || !item.inStock)) {
    alert("This item is no longer available. You can reduce its quantity or remove it.");
    showItems();
    showCart();
    return;
  }
  found.qty += change;

  if (found.qty <= 0) {            // remove the item when quantity becomes 0
    cart = cart.filter(function (c) { return c.id !== id; });
  }

  saveCart(cart);
  showCart();
}

// Remove the whole cart entry, regardless of its quantity.
function removeFromCart(id) {
  const cart = getCart().filter(function (c) { return c.id !== id; });
  saveCart(cart);
  showCart();
}

function showCart() {
  const cart = getCart();
  const itemsBox = document.getElementById("cart-items");
  const totalsBox = document.getElementById("cart-totals");

  if (cart.length === 0) {
    itemsBox.innerHTML = '<p class="empty">Your cart is empty.</p>';
    totalsBox.innerHTML = "";
    return;
  }

  let html = "";
  let subtotal = 0;

  for (const c of cart) {
    const item = findItem(c.id);
    subtotal += item.price * c.qty;

    let stockNote = "";
    if (!item.inStock) {
      stockNote = ' <span class="red-text">(Out of stock)</span>';
    }

    html += '<div class="cart-row">' +
              '<div>' + item.name + stockNote + '<br>' +
                '<button type="button" class="qty-btn" aria-label="Decrease quantity of ' + safe(item.name) + '" onclick="changeQty(' + item.id + ', -1)">-</button>' +
                '<span class="qty">' + c.qty + '</span>' +
                '<button type="button" class="qty-btn" aria-label="Increase quantity of ' + safe(item.name) + '" onclick="changeQty(' + item.id + ', 1)">+</button>' +
                '<button type="button" class="cart-remove" aria-label="Remove ' + safe(item.name) + ' from cart" onclick="removeFromCart(' + item.id + ')">Remove</button>' +
              '</div>' +
              '<div>৳' + (item.price * c.qty) + '</div>' +
            '</div>';
  }

  itemsBox.innerHTML = html;
  totalsBox.innerHTML =
    '<div><span>Subtotal</span><span>৳' + subtotal + '</span></div>' +
    '<div><span>Delivery charge</span><span>৳' + DELIVERY_CHARGE + '</span></div>' +
    '<div class="grand"><span>Total</span><span>৳' + (subtotal + DELIVERY_CHARGE) + '</span></div>';
}

function goToCheckout() {
  if (getCart().length === 0) {
    alert("Your cart is empty. Please add some items first.");
    return;
  }

  const outOfStock = getOutOfStockNames();
  if (outOfStock.length > 0) {
    alert("Out of stock: " + outOfStock.join(", ") + ". Please remove them from your cart.");
    return;
  }

  window.location.href = "checkout.html";
}

// Update the list as the customer types or chooses a category.
document.getElementById("item-search").addEventListener("input", showItems);
document.getElementById("category-filter").addEventListener("change", showItems);
document.getElementById("reset-filters").addEventListener("click", resetFilters);

// Keep this page up to date when another tab changes stock or the shared cart.
window.addEventListener("storage", function (event) {
  if (event.key === "items" || event.key === "cart" || event.key === null) {
    showItems();
    showCart();
  }
});

// Run when the page opens
showItems();
showCart();
