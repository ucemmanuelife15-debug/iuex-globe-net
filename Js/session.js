// Auto sign-out after 30 minutes of inactivity.
// Include this file on every page.
// It only does anything if the visitor is currently signed in.

(function () {
  const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  const LAST_ACTIVITY_KEY = "lastActivity";
  let timer;

  function logoutDueToInactivity() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userAccount");
    localStorage.removeItem(LAST_ACTIVITY_KEY);

    window.location.href = "signin.html";
  }

  function checkInactivity() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      return;
    }

    const lastActivity = Number(
      localStorage.getItem(LAST_ACTIVITY_KEY)
    );

    if (!lastActivity) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
      return;
    }

    const inactiveTime = Date.now() - lastActivity;

    if (inactiveTime >= TIMEOUT_MS) {
      logoutDueToInactivity();
      return;
    }

    scheduleTimer(TIMEOUT_MS - inactiveTime);
  }

  function scheduleTimer(delay) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      checkInactivity();
    }, Math.max(delay, 1000));
  }

  function recordActivity() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      return;
    }

    const lastActivity = Number(
      localStorage.getItem(LAST_ACTIVITY_KEY)
    );

    // Check whether the user already exceeded 30 minutes
    // before treating this event as new activity.
    if (lastActivity && Date.now() - lastActivity >= TIMEOUT_MS) {
      logoutDueToInactivity();
      return;
    }

    localStorage.setItem(
      LAST_ACTIVITY_KEY,
      Date.now().toString()
    );

    scheduleTimer(TIMEOUT_MS);
  }

  // Desktop and mobile activity
  [
    "mousemove",
    "keydown",
    "click",
    "scroll",
    "touchstart",
    "touchmove"
  ].forEach((eventName) => {
    document.addEventListener(eventName, recordActivity, {
      passive: true
    });
  });

  // Important for mobile browsers when a page is suspended
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      checkInactivity();
    }
  });

  // Helps when the browser restores/reopens the page
  window.addEventListener("pageshow", checkInactivity);

  // Start checking when the page loads
  checkInactivity();

})();