document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navActions = document.querySelector(".nav-actions");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    navActions.classList.toggle("active");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

 window.addEventListener("scroll", () => {
    let current = "";

    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;

    if (nearBottom) {
      current = "contact";
    } else {
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id");
        }
      });
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const protectedButtons = document.querySelectorAll(".protected-action");

  protectedButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (isLoggedIn) {
        alert("Welcome back! Taking you to your dashboard...");
        // later: window.location.href = "dashboard.html";
      } else {
        alert("Please sign in or create an account to continue.");
        // later: window.location.href = "signin.html";
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const navSignIn = document.getElementById("navSignIn");
  const navGetStarted = document.getElementById("navGetStarted");

  if (isLoggedIn && navSignIn && navGetStarted) {
    navSignIn.style.display = "none";

    navGetStarted.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
      </svg>
      My Account
    `;
    navGetStarted.href = "dashboard.html";
    navGetStarted.classList.add("nav-profile");
  }
});