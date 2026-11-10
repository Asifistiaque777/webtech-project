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

// Show all items (Food and Parcel are in different sections)
function showItems() {
  const items = getItems();
  let foodHtml = "";
  let parcelHtml = "";

  for (const item of items) {
    if (item.category === "Food") {
      foodHtml += makeCard(item);
    } else {
      parcelHtml += makeCard(item);
    }
  }

  document.getElementById("food-list").innerHTML = foodHtml;
  document.getElementById("parcel-list").innerHTML = parcelHtml;
}

// ----- Cart functions -----
function addToCart(id) {
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
  found.qty += change;

  if (found.qty <= 0) {            // remove the item when quantity becomes 0
    cart = cart.filter(function (c) { return c.id !== id; });
  }

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
                '<button class="qty-btn" onclick="changeQty(' + item.id + ', -1)">-</button>' +
                '<span class="qty">' + c.qty + '</span>' +
                '<button class="qty-btn" onclick="changeQty(' + item.id + ', 1)">+</button>' +
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

// Run when the page opens
showItems();
showCart();
