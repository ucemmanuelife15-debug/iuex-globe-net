document.addEventListener("DOMContentLoaded", () => {

  // ===== SIGN UP LOGIC =====
  const signupForm = document.querySelector(".auth-form");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullname = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const termsChecked = document.getElementById("terms").checked;

      if (!fullname || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      if (!termsChecked) {
        alert("Please agree to the Terms & Conditions to continue.");
        return;
      }

      const userData = {
        fullname: fullname,
        email: email,
        password: password
      };

      localStorage.setItem("userAccount", JSON.stringify(userData));

      alert("Account created successfully! Please sign in to continue.");
      window.location.href = "signin.html";
    });
  }

  // ===== SIGN IN LOGIC =====
  const signinForm = document.querySelector(".signin-form");

  if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const savedAccount = JSON.parse(localStorage.getItem("userAccount"));

      if (!savedAccount) {
        alert("No account found. Please sign up first.");
        return;
      }

      if (email === savedAccount.email && password === savedAccount.password) {
        localStorage.setItem("isLoggedIn", "true");
        alert("Welcome back! Redirecting you to the homepage...");
        window.location.href = "index.html";
      } else {
        alert("Incorrect email or password. Please try again.");
      }
    });
    // ===== DASHBOARD LOGIC =====
  const welcomeMessage = document.getElementById("welcomeMessage");
  const signOutBtn = document.getElementById("signOutBtn");

  if (welcomeMessage) {
    const savedAccount = JSON.parse(localStorage.getItem("userAccount"));
    if (savedAccount) {
      welcomeMessage.textContent = `Welcome, ${savedAccount.fullname}!`;
    }
  }

  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      alert("You have been signed out.");
      window.location.href = "index.html";
    });
  }
  }
  // ===== GOOGLE BUTTON PLACEHOLDER =====
  const googleButtons = document.querySelectorAll(".google-btn");

  googleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Google Sign-In is coming soon! Please use email sign up for now.");
    });
  });
});