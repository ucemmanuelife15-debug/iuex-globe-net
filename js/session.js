/* =====================================================================
   SESSION TIMEOUT  (restored from your original file)
   Signs a logged-in visitor out after 30 minutes with no activity.
   ===================================================================== */
(function () {
  const LIMIT = 30 * 60 * 1000;      // 30 minutes
  const KEY = "lastActivity";
  let timer;

  function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userAccount");
    localStorage.removeItem(KEY);
    window.location.href = "signin.html";
  }

  function checkSession() {
    if (localStorage.getItem("isLoggedIn") !== "true") return;

    const last = Number(localStorage.getItem(KEY));
    if (!last) {
      localStorage.setItem(KEY, Date.now().toString());
      return;
    }

    const elapsed = Date.now() - last;
    if (elapsed >= LIMIT) {
      logout();
      return;
    }
    schedule(LIMIT - elapsed);
  }

  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      checkSession();
    }, Math.max(ms, 1000));
  }

  function recordActivity() {
    if (localStorage.getItem("isLoggedIn") !== "true") return;

    const last = Number(localStorage.getItem(KEY));
    if (last && Date.now() - last >= LIMIT) {
      logout();
      return;
    }
    localStorage.setItem(KEY, Date.now().toString());
    schedule(LIMIT);
  }

  ["mousemove", "keydown", "click", "scroll", "touchstart", "touchmove"].forEach((ev) => {
    document.addEventListener(ev, recordActivity, { passive: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkSession();
  });
  window.addEventListener("pageshow", checkSession);

  checkSession();
})();