const REVIEWS_API = "https://iuex-globe-net-backend.onrender.com/api/reviews";

let myReview = null;
let selectedRating = 0;

document.addEventListener("DOMContentLoaded", () => {
  loadApprovedReviews();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (isLoggedIn) {
    document.getElementById("writeReviewBtn").style.display = "none";
    document.getElementById("myReviewArea").style.display = "block";
    loadMyReview();
  } else {
    document.getElementById("writeReviewBtn").style.display = "inline-block";
    document.getElementById("myReviewArea").style.display = "none";
  }

  document.getElementById("writeReviewBtn").addEventListener("click", () => {
    localStorage.setItem("redirectAfterAuth", "reviews.html");
    window.location.href = "signup.html";
  });

  setupStarPicker();

  document.getElementById("reviewForm").addEventListener("submit", handleSubmit);
  document.getElementById("editBtn").addEventListener("click", showForm);
  document.getElementById("deleteBtn").addEventListener("click", handleDelete);
  document.getElementById("cancelBtn").addEventListener("click", hideForm);
});

function setupStarPicker() {
  const stars = document.querySelectorAll("#starPicker .star");
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.value, 10);
      updateStarPicker();
    });
  });
}

function updateStarPicker() {
  const stars = document.querySelectorAll("#starPicker .star");
  stars.forEach((star) => {
    const value = parseInt(star.dataset.value, 10);
    star.classList.toggle("filled", value <= selectedRating);
  });
}

function starsDisplay(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star-display${i <= rating ? " filled" : ""}">&#9733;</span>`;
  }
  return html;
}

async function loadApprovedReviews() {
  const list = document.getElementById("reviewsList");
  try {
    const res = await fetch(`${REVIEWS_API}/approved`);
    const reviews = await res.json();

    if (!reviews.length) {
      list.innerHTML = '<div class="reviews-empty">No reviews yet — be the first to share your experience.</div>';
      document.getElementById("avgRatingArea").style.display = "none";
      return;
    }

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    document.getElementById("avgRatingValue").textContent = avg.toFixed(1);
    document.getElementById("avgRatingStars").innerHTML = starsDisplay(Math.round(avg));
    document.getElementById("avgRatingCount").textContent = `based on ${reviews.length} review${reviews.length === 1 ? "" : "s"}`;
    document.getElementById("avgRatingArea").style.display = "flex";

    list.innerHTML = reviews.map((r) => {
      const user = r.userId || {};
      const name = user.fullname || "IUEX Globe.Net User";
      const photo = user.profilePicture || "images/Logo/MB Logo without name.png";
      const date = new Date(r.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
      return `
        <div class="review-card">
          <img src="${photo}" alt="${name}" class="review-avatar">
          <div class="review-body">
            <div class="review-top">
              <span class="review-name">${name}</span>
              <span class="review-date">${date}</span>
            </div>
            <div class="review-stars">${starsDisplay(r.rating)}</div>
            <p class="review-comment">${r.comment}</p>
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    list.innerHTML = '<div class="reviews-empty">Could not load reviews right now.</div>';
  }
}

async function loadMyReview() {
  const statusArea = document.getElementById("myReviewStatus");
  try {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${REVIEWS_API}/mine`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    myReview = await res.json();

    if (!myReview) {
      statusArea.innerHTML = "";
      showForm();
      return;
    }

    hideForm();
    const badge = myReview.status === "approved"
      ? '<span class="status-badge status-live">Live</span>'
      : '<span class="status-badge status-pending">Pending approval</span>';

    statusArea.innerHTML = `
      <div class="my-review-card">
        <div class="review-stars">${starsDisplay(myReview.rating)}</div>
        <p class="review-comment">${myReview.comment}</p>
        ${badge}
      </div>
    `;
    document.getElementById("myReviewActions").style.display = "flex";
  } catch (err) {
    statusArea.innerHTML = '<div class="reviews-empty">Could not load your review.</div>';
  }
}

function showForm() {
  document.getElementById("myReviewActions").style.display = "none";
  document.getElementById("reviewFormArea").style.display = "block";

  if (myReview) {
    selectedRating = myReview.rating;
    document.getElementById("commentInput").value = myReview.comment;
  } else {
    selectedRating = 0;
    document.getElementById("commentInput").value = "";
  }
  updateStarPicker();
}

function hideForm() {
  document.getElementById("reviewFormArea").style.display = "none";
  if (myReview) {
    document.getElementById("myReviewActions").style.display = "flex";
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const errorBox = document.getElementById("formError");
  errorBox.textContent = "";

  const comment = document.getElementById("commentInput").value.trim();
  if (!selectedRating) {
    errorBox.textContent = "Please choose a star rating.";
    return;
  }
  if (!comment) {
    errorBox.textContent = "Please write a comment.";
    return;
  }

  const submitBtn = document.getElementById("submitReviewBtn");
  const isEdit = !!myReview;
  submitBtn.disabled = true;
  submitBtn.textContent = "Please wait...";

  try {
    const token = localStorage.getItem("authToken");
    const url = isEdit ? `${REVIEWS_API}/${myReview._id}` : REVIEWS_API;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ rating: selectedRating, comment })
    });
    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.message || "Something went wrong.";
      submitBtn.disabled = false;
      submitBtn.textContent = isEdit ? "Save Changes" : "Submit Review";
      return;
    }

    await loadMyReview();
    await loadApprovedReviews();
  } catch (err) {
    errorBox.textContent = "Could not reach server. Try again.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isEdit ? "Save Changes" : "Submit Review";
  }
}

async function handleDelete() {
  if (!myReview) return;
  if (!confirm("Delete your review? This can't be undone.")) return;

  try {
    const token = localStorage.getItem("authToken");
    await fetch(`${REVIEWS_API}/${myReview._id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    myReview = null;
    document.getElementById("myReviewActions").style.display = "none";
    document.getElementById("myReviewStatus").innerHTML = "";
    showForm();
    await loadApprovedReviews();
  } catch (err) {
    alert("Could not delete your review. Try again.");
  }
}