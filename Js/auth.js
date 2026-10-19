/* =====================================================================
   AUTHENTICATION  (restored from your original file)
   Handles: sign up, sign in, forgot password, reset password,
   the show/hide password buttons, the welcome name, the admin link,
   the sign-out button and the "Google sign-in coming soon" message.
   ===================================================================== */
const API = "https://iuex-globe-net-backend.onrender.com/api/auth";

document.addEventListener("DOMContentLoaded", () => {

  // ===== PASSWORD SHOW/HIDE (single toggle) =====
  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      toggleBtn.textContent = isPassword ? "🙈" : "👁";
    });
  }

  // ===== SIGN UP =====
  const signupForm = document.querySelector(".auth-form");
  if (signupForm) {
    const submitBtn = signupForm.querySelector(".auth-submit");
    const originalText = submitBtn.textContent;

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullname = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      const terms = document.getElementById("terms").checked;

      if (!fullname || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      if (!terms) {
        alert("Please agree to the Terms & Conditions to continue.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Please wait...";

      try {
        const response = await fetch(API + "/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullname, email, password })
        });
        const data = await response.json();

        if (response.ok) {
          window.location.href = "signin.html";
        } else {
          alert(data.message);
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } catch (error) {
        alert("Something went wrong. Please try again.");
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // ===== SIGN IN =====
  const signinForm = document.querySelector(".signin-form");
  if (signinForm) {
    const submitBtn = signinForm.querySelector(".auth-submit");
    const originalText = submitBtn.textContent;

    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      submitBtn.disabled = true;
      submitBtn.textContent = "Please wait...";

      try {
        const response = await fetch(API + "/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userAccount", JSON.stringify({
            userId: data.userId,
            fullname: data.fullname,
            email: email,
            isAdmin: data.isAdmin || false,
            isMainAdmin: data.isMainAdmin || false,
            username: data.username || "",
            profilePicture: data.profilePicture || ""
          }));
          window.location.href = "index.html";
        } else {
          alert(data.message);
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } catch (error) {
        alert("Something went wrong. Please try again.");
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // ===== WELCOME NAME (dashboard) =====
  const welcomeMessage = document.getElementById("welcomeMessage");
  const signOutBtn = document.getElementById("signOutBtn");
  if (welcomeMessage) {
    const savedAccount = JSON.parse(localStorage.getItem("userAccount"));
    if (savedAccount) {
      const firstName = savedAccount.fullname.split(" ")[0];
      welcomeMessage.textContent = "Welcome, " + firstName + "!";
    }
  }

  // ===== ADMIN LINK =====
  const adminLink = document.getElementById("adminLink");
  if (adminLink) {
    const savedAccount = JSON.parse(localStorage.getItem("userAccount") || "null");
    if (savedAccount && savedAccount.isAdmin) {
      adminLink.style.display = "block";
    }
  }

  // ===== SIGN OUT =====
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "index.html";
    });
  }

  // ===== GOOGLE BUTTONS =====
  document.querySelectorAll(".google-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Google Sign-In is coming soon! Please use email sign up for now.");
    });
  });

  // ===== FORGOT PASSWORD =====
  const forgotForm = document.querySelector(".forgot-password-form");
  if (forgotForm) {
    const submitBtn = forgotForm.querySelector(".auth-submit");
    const originalText = submitBtn.textContent;

    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      submitBtn.disabled = true;
      submitBtn.textContent = "Please wait...";

      try {
        const response = await fetch(API + "/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await response.json();

        if (response.ok) {
          alert("Password reset link sent! Please check your email.");
          forgotForm.reset();
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Something went wrong. Please try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // ===== RESET PASSWORD =====
  const resetForm = document.querySelector(".reset-password-form");
  if (resetForm) {
    const submitBtn = resetForm.querySelector(".auth-submit");
    const originalText = submitBtn.textContent;

    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (!token) {
        alert("Invalid or missing reset link.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Please wait...";

      try {
        const response = await fetch(API + "/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword })
        });
        const data = await response.json();

        if (response.ok) {
          alert("Password reset successfully! Please sign in with your new password.");
          window.location.href = "signin.html";
        } else {
          alert(data.message);
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } catch (error) {
        alert("Something went wrong. Please try again.");
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
});

// ===== SHOW/HIDE PASSWORD (any button with class "password-toggle" and data-target="inputId") =====
document.querySelectorAll(".password-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "🙈";
      btn.setAttribute("aria-label", "Hide password");
    } else {
      input.type = "password";
      btn.textContent = "👁️";
      btn.setAttribute("aria-label", "Show password");
    }
  });
});