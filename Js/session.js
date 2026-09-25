// Auto sign-out after 30 minutes of inactivity.
// Include this file on every page. It only does anything if the
// visitor is currently signed in.
(function () {
  const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  let timer;

  function logoutDueToInactivity() {
    if (localStorage.getItem("isLoggedIn") === "true") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userAccount");
      window.location.href = "signin.html";
    }
  }

  function resetTimer() {
    if (localStorage.getItem("isLoggedIn") !== "true") return;
    clearTimeout(timer);
    timer = setTimeout(logoutDueToInactivity, TIMEOUT_MS);
  }

  ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach((evt) => {
    document.addEventListener(evt, resetTimer, { passive: true });
  });

  resetTimer();
})();