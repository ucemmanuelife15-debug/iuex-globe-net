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

    const savedAccount = JSON.parse(localStorage.getItem("userAccount") || "null");
    let displayName = "there";
    let avatarHtml = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
      </svg>
    `;

    if (savedAccount) {
      displayName = savedAccount.username || savedAccount.fullname.split(" ")[0];
      if (savedAccount.profilePicture) {
        avatarHtml = `<img src="${savedAccount.profilePicture}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;">`;
      }
    }

       navGetStarted.innerHTML = `${avatarHtml} Welcome, ${displayName}`;
    navGetStarted.href = "#";
    navGetStarted.classList.remove("cta-btn");
    navGetStarted.classList.add("nav-profile");

       const mobileProfileIcon = document.getElementById("mobileProfileIcon");
    if (mobileProfileIcon) {
      mobileProfileIcon.classList.add("logged-in");
      if (savedAccount && savedAccount.profilePicture) {
        mobileProfileIcon.innerHTML = `<img src="${savedAccount.profilePicture}">`;
      }
      mobileProfileIcon.addEventListener("click", (e) => {
        e.preventDefault();
        navGetStarted.click();
      });
    }
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
  const adminLink = document.getElementById("adminLink");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // ===== SHOW ADMIN LINK IF USER IS ADMIN =====
  if (isLoggedIn && adminLink) {
    const savedAccount = JSON.parse(localStorage.getItem("userAccount") || "null");
    if (savedAccount && savedAccount.isAdmin) {
      adminLink.style.display = "block";
    }
  }

  if (isLoggedIn && navGetStarted) {
    navGetStarted.addEventListener("click", (e) => {
      e.preventDefault();

     const savedAccount = JSON.parse(localStorage.getItem("userAccount"));
if (savedAccount) {
  accountName.textContent = savedAccount.fullname.split(" ")[0];
  accountEmail.textContent = savedAccount.email;
  if (savedAccount.profilePicture) {
    document.querySelector(".profile-avatar").innerHTML =
      `<img src="${savedAccount.profilePicture}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
  }
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
         if (savedAccount.profilePicture) {
           document.querySelector(".profile-avatar").innerHTML =
             `<img src="${savedAccount.profilePicture}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
         }
       }

       accountPanel.classList.add("active");
       accountOverlay.classList.add("active");
     });
   }
   window.fillAndOpenAccountPanel = function () {
  const savedAccount = JSON.parse(localStorage.getItem("userAccount") || "null");
  if (savedAccount) {
    accountName.textContent = savedAccount.fullname.split(" ")[0];
    accountEmail.textContent = savedAccount.email;
    if (savedAccount.profilePicture) {
      document.querySelector(".profile-avatar").innerHTML =
        `<img src="${savedAccount.profilePicture}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    }
  }
  accountPanel.classList.add("active");
  accountOverlay.classList.add("active");
};
  const contactUsToggle = document.getElementById("contactUsToggle");
const contactOptions = document.getElementById("contactOptions");

if (contactUsToggle && contactOptions) {
  contactUsToggle.addEventListener("click", (e) => {
    e.preventDefault();
    contactOptions.style.display = contactOptions.style.display === "none" ? "flex" : "none";
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