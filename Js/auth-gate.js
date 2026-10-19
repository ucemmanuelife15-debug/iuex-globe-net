/* =====================================================================
   AUTH GATE  (restored from your original file)
   Used by links like:  onclick="return gateClick(event, this)"
   Logged in     -> the link works normally.
   Not logged in -> remembers where they wanted to go, sends them to sign-up.
   ===================================================================== */
function gateClick(e, el) {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!loggedIn) {
    e.preventDefault();
    const target = el.getAttribute("href");
    localStorage.setItem("redirectAfterAuth", target);
    window.location.href = "signup.html";
    return false;
  }
  return true;
}