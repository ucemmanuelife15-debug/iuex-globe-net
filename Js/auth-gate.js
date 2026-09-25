// Shared auth gate — include this file on every page that has a
// button/link that should require sign in first (Learn More, Explore
// Products, Need Help, etc).
//
// Usage on any <a>:
//   <a href="somepage.html" onclick="return gateClick(event, this)">...</a>
//
function gateClick(e, el) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    e.preventDefault();
    const target = el.getAttribute("href");
    localStorage.setItem("redirectAfterAuth", target);
    window.location.href = "signup.html";
    return false;
  }
  return true; // logged in — let the link work normally
}