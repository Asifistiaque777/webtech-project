// ===== Admin login (demo only: the email and password are written here) =====
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();                        // stop the page from reloading

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem("adminLoggedIn", "yes");   // remember that admin is logged in
    window.location.href = "admin.html";
  } else {
    document.getElementById("error").innerText = "Wrong email or password.";
  }
});
