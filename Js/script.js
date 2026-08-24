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
    navGetStarted.classList.remove("cta-btn");
    navGetStarted.classList.add("nav-profile");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const navGetStarted = document.getElementById("navGetStarted");
  const accountPanel = document.getElementById("accountPanel");
  const accountOverlay = document.getElementById("accountOverlay");
  const accountClose = document.getElementById("accountClose");
  const accountSignOut = document.getElementById("accountSignOut");
  const accountName = document.getElementById("accountName");
  const accountEmail = document.getElementById("accountEmail");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn && navGetStarted) {
    navGetStarted.addEventListener("click", (e) => {
      e.preventDefault();

      const savedAccount = JSON.parse(localStorage.getItem("userAccount"));
      if (savedAccount) {
        accountName.textContent = savedAccount.fullname.split(" ")[0];
        accountEmail.textContent = savedAccount.email;
      }

      accountPanel.classList.add("active");
      accountOverlay.classList.add("active");
    });
  }

  function closePanel() {
    accountPanel.classList.remove("active");
    accountOverlay.classList.remove("active");
  }

  if (accountClose) accountClose.addEventListener("click", closePanel);
  if (accountOverlay) accountOverlay.addEventListener("click", closePanel);

  if (accountSignOut) {
    accountSignOut.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      window.location.href = "index.html";
    });
  }
  const ctaGetStarted = document.getElementById("ctaGetStarted");
  const isLoggedInCheck = localStorage.getItem("isLoggedIn") === "true";

  if (ctaGetStarted && isLoggedInCheck) {
    ctaGetStarted.addEventListener("click", (e) => {
      e.preventDefault();

      const savedAccount = JSON.parse(localStorage.getItem("userAccount"));
      if (savedAccount) {
        accountName.textContent = savedAccount.fullname.split(" ")[0];
        accountEmail.textContent = savedAccount.email;
      }

      accountPanel.classList.add("active");
      accountOverlay.classList.add("active");
    });
  }
  const profileSettingsLink = document.querySelector(".account-links a[href='#']:not(#accountSignOut)");

  if (profileSettingsLink) {
    profileSettingsLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Profile Settings coming soon!");
    });
  }
});
const guestGateButtons = document.querySelectorAll(".guest-gate");

  guestGateButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const message = btn.getAttribute("data-message") || "This feature is coming soon!";

      if (loggedIn) {
        alert(message);
      } else {
        window.location.href = "signup.html";
      }
    });
  });