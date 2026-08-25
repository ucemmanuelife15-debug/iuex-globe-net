document.addEventListener("DOMContentLoaded", () => {

 // ===== SIGN UP LOGIC =====
  const signupForm = document.querySelector(".auth-form");

    if (signupForm) {
    const signupButton = signupForm.querySelector(".auth-submit");
    const signupButtonOriginalText = signupButton.textContent;

    signupForm.addEventListener("submit", async (e) => {
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

      signupButton.disabled = true;
      signupButton.textContent = "Please wait...";

      try {
        const response = await fetch("https://iuex-globe-net-backend.onrender.com/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullname, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          window.location.href = "signin.html";
        } else {
          alert(data.message);
          signupButton.disabled = false;
          signupButton.textContent = signupButtonOriginalText;
        }
      } catch (error) {
        alert("Something went wrong. Please try again.");
        signupButton.disabled = false;
        signupButton.textContent = signupButtonOriginalText;
      }
    });
  }
 // ===== SIGN IN LOGIC =====
  const signinForm = document.querySelector(".signin-form");

    if (signinForm) {
    const signinButton = signinForm.querySelector(".auth-submit");
    const signinButtonOriginalText = signinButton.textContent;

    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      signinButton.disabled = true;
      signinButton.textContent = "Please wait...";

      try {
        const response = await fetch("https://iuex-globe-net-backend.onrender.com/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userAccount", JSON.stringify({ fullname: data.fullname, email }));
          window.location.href = "index.html";
        } else {
          alert(data.message);
          signinButton.disabled = false;
          signinButton.textContent = signinButtonOriginalText;
        }
      } catch (error) {
        alert("Something went wrong. Please try again.");
        signinButton.disabled = false;
        signinButton.textContent = signinButtonOriginalText;
      }
    });
  }
  // ===== DASHBOARD LOGIC =====
  const welcomeMessage = document.getElementById("welcomeMessage");
  const signOutBtn = document.getElementById("signOutBtn");

  if (welcomeMessage) {
    const savedAccount = JSON.parse(localStorage.getItem("userAccount"));
    if (savedAccount) {
      const firstName = savedAccount.fullname.split(" ")[0];
      welcomeMessage.textContent = `Welcome, ${firstName}!`;
    }
  }
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "index.html";
    });
  }
  // ===== GOOGLE BUTTON PLACEHOLDER =====
  const googleButtons = document.querySelectorAll(".google-btn");

  googleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Google Sign-In is coming soon! Please use email sign up for now.");
    });
  });
});