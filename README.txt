FoodParcel Express - Food & Parcel Delivery Management System
(HTML + CSS + JavaScript only, no Node.js, no backend)

HOW TO RUN
  Double-click index.html (best in Chrome or Edge).
  If you use VS Code, "Live Server" also works.

ADMIN LOGIN
  Email:    admin@gmail.com
  Password: admin123

FILES
  index.html       Customer order page (food + parcel items, cart)
  checkout.html    Customer details + place order
  admin-login.html Admin login
  admin.html       Admin panel (sidebar: Items / Orders)

  components/items.js   Items component  (stock in / out)
  components/orders.js  Orders component (all orders + status change)

  js/data.js       Demo items + localStorage helper functions
  js/order.js      Order page logic (show items, cart)
  js/checkout.js   Checkout logic (validation, save order)
  js/login.js      Admin login check
  js/admin.js      Login guard + switching between components
  css/style.css    All styling

DATA
  Items, cart and orders are saved in the browser's localStorage.
  To reset everything: open DevTools (F12) > Application > Local Storage > Clear.
