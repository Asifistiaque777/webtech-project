// ===== Rider login (demo only: riders are listed in data.js) =====

document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();                        // stop the page from reloading

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  // find a rider with this email and password
  const found = RIDERS.find(function (r) {
    return r.email === email && r.password === password;
  });

  if (found) {
    sessionStorage.setItem("riderId", found.id);      // remember which rider is logged in
    window.location.href = "rider.html";
  } else {
    document.getElementById("error").innerText = "Wrong email or password.";
  }
});
