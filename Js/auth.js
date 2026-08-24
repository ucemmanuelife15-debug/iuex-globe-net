document.addEventListener("DOMContentLoaded", () => {

 // ===== SIGN UP LOGIC =====
  const signupForm = document.querySelector(".auth-form");

  if (signupForm) {
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

      try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullname, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          window.location.href = "signin.html";
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Something went wrong. Please try again.");
      }
    });
  }
 // ===== SIGN IN LOGIC =====
  const signinForm = document.querySelector(".signin-form");

  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const response = await fetch("http://localhost:5000/api/auth/signin", {
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
        }
      } catch (error) {
        alert("Something went wrong. Please try again.");
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