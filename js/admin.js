// ===== Admin page: login check + switching between components =====

// If the admin is not logged in, send them to the login page
if (sessionStorage.getItem("adminLoggedIn") !== "yes") {
  window.location.href = "admin-login.html";
}

const content = document.getElementById("admin-content");

// Show the Items component or the Orders component
function showPage(page) {
  document.getElementById("nav-items").classList.remove("active");
  document.getElementById("nav-orders").classList.remove("active");

  if (page === "items") {
    loadItemsComponent(content);              // from components/items.js
    document.getElementById("nav-items").classList.add("active");
    document.getElementById("page-title").innerText = "Items";
  } else {
    loadOrdersComponent(content);             // from components/orders.js
    document.getElementById("nav-orders").classList.add("active");
    document.getElementById("page-title").innerText = "Orders";
  }
}

function logout() {
  sessionStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}

// Open the Items component first
showPage("items");
