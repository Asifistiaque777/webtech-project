// ===== Orders component: list of all customer orders =====

// Pick a badge colour for each status
function statusClass(status) {
  if (status === "Delivered") return "success";
  if (status === "On the way") return "info";
  return "warning";                               // Pending
}

function loadOrdersComponent(box) {
  const orders = getOrders();
  let html = '<h2>Orders</h2><p class="subtitle">All orders placed by customers (newest first).</p>';

  if (orders.length === 0) {
    box.innerHTML = html + '<div class="table-box"><p>No orders yet.</p></div>';
    return;
  }

  let rows = "";
  for (let i = orders.length - 1; i >= 0; i--) {   // newest order first
    const o = orders[i];

    // "2 x Beef Burger", "1 x Cold Drink" ...
    let itemLines = "";
    for (const it of o.items) {
      itemLines += it.qty + ' x ' + it.name + '<br>';
    }

    let note = "";
    if (o.note !== "") {
      note = '<br><small>Note: ' + safe(o.note) + '</small>';
    }

    rows += '<tr>' +
              '<td>' + o.id + '<br><small>' + o.date + '</small></td>' +
              '<td>' + safe(o.name) + '<br>' + safe(o.phone) + '</td>' +
              '<td>' + safe(o.address) + note + '</td>' +
              '<td>' + itemLines + '</td>' +
              '<td>৳' + o.total + '<br><small>' + o.payment + '</small></td>' +
              '<td>' +
                '<span class="badge ' + statusClass(o.status) + '">' + o.status + '</span><br><br>' +
                '<select onchange="changeStatus(\'' + o.id + '\', this.value)">' +
                  makeOption("Pending", o.status) +
                  makeOption("On the way", o.status) +
                  makeOption("Delivered", o.status) +
                '</select>' +
              '</td>' +
            '</tr>';
  }

  box.innerHTML = html +
    '<div class="table-box">' +
      '<table>' +
        '<thead><tr><th>Order</th><th>Customer</th><th>Address</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
    '</div>';
}

// One <option> for the status dropdown
function makeOption(value, currentStatus) {
  let selected = "";
  if (value === currentStatus) {
    selected = " selected";
  }
  return '<option value="' + value + '"' + selected + '>' + value + '</option>';
}

// Save the new status chosen by the admin
function changeStatus(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find(function (o) { return o.id === orderId; });

  order.status = newStatus;
  saveOrders(orders);

  loadOrdersComponent(document.getElementById("admin-content"));   // refresh the table
}
