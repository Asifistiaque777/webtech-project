// ===== Checkout page: show summary + save the order =====

// Show the cart items and totals in the summary box
// (returns the subtotal so we can reuse it)
function showSummary() {
  const cart = getCart();
  let html = "";
  let subtotal = 0;

  for (const c of cart) {
    const item = findItem(c.id);
    subtotal += item.price * c.qty;
    html += '<div class="cart-row">' +
              '<span>' + item.name + ' x ' + c.qty + '</span>' +
              '<span>৳' + (item.price * c.qty) + '</span>' +
            '</div>';
  }

  document.getElementById("summary").innerHTML = html;
  document.getElementById("summary-totals").innerHTML =
    '<div><span>Subtotal</span><span>৳' + subtotal + '</span></div>' +
    '<div><span>Delivery charge</span><span>৳' + DELIVERY_CHARGE + '</span></div>' +
    '<div class="grand"><span>Total</span><span>৳' + (subtotal + DELIVERY_CHARGE) + '</span></div>';
}

function showError(message) {
  document.getElementById("error").innerText = message;
}

function placeOrder() {
  // 1. Read the form values
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const note = document.getElementById("note").value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;

  // 2. Validate
  if (name === "") {
    showError("Please enter your name.");
    return;
  }
  if (!/^01[0-9]{9}$/.test(phone)) {          // Bangladeshi number: 11 digits, starts with 01
    showError("Please enter a valid 11 digit phone number (01XXXXXXXXX).");
    return;
  }
  if (address === "") {
    showError("Please enter your delivery address.");
    return;
  }

  // 3. Stock may have changed since the customer added items
  const outOfStock = getOutOfStockNames();
  if (outOfStock.length > 0) {
    showError("Out of stock: " + outOfStock.join(", ") + ". Please go back and remove them.");
    return;
  }

  // 4. Build the order object
  const cart = getCart();
  const orderItems = [];
  let subtotal = 0;

  for (const c of cart) {
    const item = findItem(c.id);
    subtotal += item.price * c.qty;
    orderItems.push({ name: item.name, price: item.price, qty: c.qty });
  }

  const orders = getOrders();
  const order = {
    id: "ORD-" + (1001 + orders.length),
    name: name,
    phone: phone,
    address: address,
    note: note,
    payment: payment,
    items: orderItems,
    total: subtotal + DELIVERY_CHARGE,
    date: new Date().toLocaleString(),
    status: "Pending",
    riderId: null,          // set when a rider accepts the order
    riderName: ""
  };

  // 5. Save the order and clear the cart
  orders.push(order);
  saveOrders(orders);
  saveCart([]);

  // 6. Show the success message
  document.getElementById("checkout-layout").style.display = "none";
  document.getElementById("success-box").style.display = "block";
  document.getElementById("order-id").innerText = order.id;
}

// ----- Run when the page opens -----
if (getCart().length === 0) {
  document.getElementById("checkout-layout").style.display = "none";
  document.getElementById("empty-box").style.display = "block";
} else {
  showSummary();
}

document.getElementById("checkout-form").addEventListener("submit", function (event) {
  event.preventDefault();                       // stop the page from reloading
  placeOrder();
});
