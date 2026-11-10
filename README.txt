FoodParcel Express - Food & Parcel Delivery Management System
(HTML + CSS + JavaScript only, no Node.js, no backend)

HOW TO RUN
  Double-click index.html (best in Chrome or Edge).
  If you use VS Code, "Live Server" also works.

LOGINS (demo)
  Admin:  admin@gmail.com  / admin123
  Riders: rahim@rider.com / rider123
          karim@rider.com / rider123
          sumon@rider.com / rider123
  (Admin Login and Rider Login buttons are in the footer of the customer pages.)

ORDER FLOW
  Customer places order  -> status "Pending"
  Rider presses Accept   -> "Accepted"   (rider name is saved on the order)
  Rider presses Picked Up-> "Picked Up"
  Rider presses Delivered-> "Delivered"
  The admin Orders page shows the rider name and the current status of every order.

FILES
  index.html        Customer order page (food + parcel items, cart)
  checkout.html     Customer details + place order
  admin-login.html  Admin login
  admin.html        Admin panel (sidebar: Items / Orders)
  rider-login.html  Rider login
  rider.html        Rider panel (New Orders / My Deliveries / Completed)

  components/items.js   Admin Items component  (stock in / out)
  components/orders.js  Admin Orders component (orders, rider, status)

  js/data.js          Demo items, riders, localStorage helper functions
  js/order.js         Order page logic (show items, cart)
  js/checkout.js      Checkout logic (validation, save order)
  js/login.js         Admin login check
  js/admin.js         Admin login guard + switching between components
  js/rider-login.js   Rider login check
  js/rider.js         Rider panel logic (accept, pick up, deliver)
  css/style.css       All styling

DATA
  Items, cart and orders are saved in the browser's localStorage, so the
  customer, admin and rider pages must be opened in the SAME browser to share data.
  To reset everything: open DevTools (F12) > Application > Local Storage > Clear.
