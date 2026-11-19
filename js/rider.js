// ===== Rider panel: see orders, accept, pick up, deliver =====

// Which rider is logged in? (saved by rider-login.js)
const rider = RIDERS.find(function (r) {
  return r.id === sessionStorage.getItem("riderId");
});

const content = document.getElementById("rider-content");
const STAGES = ["Accepted", "Picked Up", "Delivered"];
let currentPage = "new";

// ----- Small HTML makers -----

// Cards at the top: new orders, in progress, completed
function makeStats(orders, mine) {
  const newCount = orders.filter(function (o) { return o.status === "Pending"; }).length;
  const doneCount = mine.filter(function (o) { return o.status === "Delivered"; }).length;
  const inProgress = mine.length - doneCount;            // accepted but not delivered yet

  return '<div class="cards">' +
           statCard("New Orders", newCount) +
           statCard("In Progress", inProgress) +
           statCard("Completed", doneCount) +
         '</div>';
}

// Accepted -> Picked Up -> Delivered (finished steps become green)
function makeSteps(status) {
  const current = STAGES.indexOf(status);
  let html = '<div class="steps">';

  for (let i = 0; i < STAGES.length; i++) {
    let cls = "step";
    if (i <= current) {
      cls += " done";
    }
    html += '<span class="' + cls + '">' + STAGES[i] + '</span>';
  }
  return html + '</div>';
}

// One order card with the right button for its status
function makeOrderCard(o) {
  let itemLines = "";
  for (const it of o.items) {
    itemLines += it.qty + ' x ' + it.name + '<br>';
  }

  let note = "";
  if (o.note !== "") {
    note = '<p><b>Note:</b> ' + safe(o.note) + '</p>';
  }

  let steps = "";
  let button = "";

  if (o.status === "Pending") {
    button = '<button class="btn" onclick="acceptOrder(\'' + o.id + '\')">Accept Order</button>';
  } else {
    steps = makeSteps(o.status);
    if (o.status === "Accepted") {
      button = '<button class="btn" onclick="updateStep(\'' + o.id + '\', \'Picked Up\')">Mark as Picked Up</button>';
    } else if (o.status === "Picked Up") {
      button = '<button class="btn" onclick="updateStep(\'' + o.id + '\', \'Delivered\')">Mark as Delivered</button>';
    }
  }

  return '<div class="order-card">' +
           '<div class="order-head">' +
             '<b>' + o.id + '</b>' +
             '<span class="badge ' + statusClass(o.status) + '">' + o.status + '</span>' +
           '</div>' +
           '<p><small>' + o.date + '</small></p>' +
           '<p><b>' + safe(o.name) + '</b> - <a href="tel:' + safe(o.phone) + '">' + safe(o.phone) + '</a></p>' +
           '<p>' + safe(o.address) + '</p>' +
           note +
           '<div class="order-items">' + itemLines + '</div>' +
           '<p><b>Total: ৳' + o.total + '</b> (' + o.payment + ')</p>' +
           steps +
           button +
         '</div>';
}

// ----- Pages -----

function showPage(page) {
  currentPage = page;

  const orders = getOrders();
  const mine = orders.filter(function (o) { return o.riderId === rider.id; });

  let list;
  let title;
  let emptyText;

  if (page === "new") {
    list = orders.filter(function (o) { return o.status === "Pending"; });
    title = "New Orders";
    emptyText = "No new orders right now.";
  } else if (page === "mine") {
    list = mine.filter(function (o) { return o.status !== "Delivered"; });
    title = "My Deliveries";
    emptyText = "You have no active deliveries. Accept an order from New Orders.";
  } else {
    list = mine.filter(function (o) { return o.status === "Delivered"; });
    title = "Completed";
    emptyText = "You have not completed any delivery yet.";
  }

  // sidebar highlight + page title
  document.getElementById("nav-new").classList.remove("active");
  document.getElementById("nav-mine").classList.remove("active");
  document.getElementById("nav-done").classList.remove("active");
  document.getElementById("nav-" + page).classList.add("active");
  document.getElementById("page-title").innerText = title;

  let html = makeStats(orders, mine);

  if (list.length === 0) {
    html += '<div class="table-box"><p>' + emptyText + '</p></div>';
  } else {
    list.reverse();                                  // newest first
    html += '<div class="order-list">';
    for (const o of list) {
      html += makeOrderCard(o);
    }
    html += '</div>';
  }

  content.innerHTML = html;
}

// ----- Actions -----

// Rider takes a new order
function acceptOrder(orderId) {
  const orders = getOrders();
  const order = orders.find(function (o) { return o.id === orderId; });

  // maybe another rider took it a moment ago
  if (order.status !== "Pending") {
    alert("Sorry, this order is already taken by another rider.");
    showPage(currentPage);
    return;
  }

  order.status = "Accepted";
  order.riderId = rider.id;
  order.riderName = rider.name;
  saveOrders(orders);

  showPage("mine");                                  // go to My Deliveries
}

// Accepted -> Picked Up -> Delivered
function updateStep(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find(function (o) { return o.id === orderId; });

  // a rider can only change his own orders
  if (order.riderId !== rider.id) {
    alert("This order belongs to another rider.");
    showPage(currentPage);
    return;
  }

  order.status = newStatus;
  saveOrders(orders);

  showPage(currentPage);
}

function logout() {
  sessionStorage.removeItem("riderId");
  window.location.href = "rider-login.html";
}

// ----- Run when the page opens -----
if (rider === undefined) {
  window.location.href = "rider-login.html";         // not logged in
} else {
  document.getElementById("rider-name").innerText = "Hi, " + rider.name;
  showPage("new");
}
