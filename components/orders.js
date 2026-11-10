// ===== Orders component (admin): all orders, which rider took them, and their status =====

function loadOrdersComponent(box) {
  const orders = getOrders();

  // count orders for the cards at the top
  let pending = 0;
  let inProgress = 0;
  let delivered = 0;
  for (const o of orders) {
    if (o.status === "Pending") {
      pending++;
    } else if (o.status === "Delivered") {
      delivered++;
    } else {
      inProgress++;                                  // Accepted or Picked Up
    }
  }

  let html = '<h2>Orders</h2><p class="subtitle">All orders placed by customers (newest first). Riders update the status.</p>' +
    '<div class="cards">' +
      statCard("Total Orders", orders.length) +
      statCard("Waiting for Rider", pending) +
      statCard("In Progress", inProgress) +
      statCard("Delivered", delivered) +
    '</div>';

  if (orders.length === 0) {
    box.innerHTML = html + '<div class="table-box"><p>No orders yet.</p></div>';
    return;
  }

  let rows = "";
  for (let i = orders.length - 1; i >= 0; i--) {     // newest order first
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

    let riderCell = '<span class="empty">Not assigned yet</span>';
    if (o.riderName) {
      riderCell = '<b>' + safe(o.riderName) + '</b>';
    }

    rows += '<tr>' +
              '<td>' + o.id + '<br><small>' + o.date + '</small></td>' +
              '<td>' + safe(o.name) + '<br>' + safe(o.phone) + '</td>' +
              '<td>' + safe(o.address) + note + '</td>' +
              '<td>' + itemLines + '</td>' +
              '<td>৳' + o.total + '<br><small>' + o.payment + '</small></td>' +
              '<td>' + riderCell + '</td>' +
              '<td><span class="badge ' + statusClass(o.status) + '">' + o.status + '</span></td>' +
            '</tr>';
  }

  box.innerHTML = html +
    '<div class="table-box">' +
      '<table>' +
        '<thead><tr><th>Order</th><th>Customer</th><th>Address</th><th>Items</th><th>Total</th><th>Rider</th><th>Status</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
    '</div>';
}
