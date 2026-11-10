// ===== Items component: list of items + stock in / out =====

function loadItemsComponent(box) {
  const items = getItems();

  let rows = "";
  for (const item of items) {
    let badge;
    let button;

    if (item.inStock) {
      badge = '<span class="badge success">In Stock</span>';
      button = '<button class="btn btn-small btn-danger" onclick="toggleStock(' + item.id + ')">Mark Out of Stock</button>';
    } else {
      badge = '<span class="badge danger">Out of Stock</span>';
      button = '<button class="btn btn-small btn-green" onclick="toggleStock(' + item.id + ')">Mark In Stock</button>';
    }

    rows += '<tr>' +
              '<td><img class="thumb" src="' + item.image + '" alt="" onerror="imgError(this)"></td>' +
              '<td>' + item.name + '</td>' +
              '<td>' + item.category + '</td>' +
              '<td>৳' + item.price + '</td>' +
              '<td>' + badge + '</td>' +
              '<td>' + button + '</td>' +
            '</tr>';
  }

  box.innerHTML =
    '<h2>Items</h2>' +
    '<p class="subtitle">Change the stock status of items. Customers can not order out of stock items.</p>' +
    '<div class="table-box">' +
      '<table>' +
        '<thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
    '</div>';
}

// Flip the stock status (in stock <-> out of stock)
function toggleStock(id) {
  const items = getItems();
  const item = items.find(function (i) { return i.id === id; });

  item.inStock = !item.inStock;
  saveItems(items);

  loadItemsComponent(document.getElementById("admin-content"));   // refresh the table
}
