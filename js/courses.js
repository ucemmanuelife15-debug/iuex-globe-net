/* =====================================================================
   COURSES PAGE  (restored from your original file)
   Loads the course list from your backend and draws the cards.
   Each course picture comes from the course's own imageUrl, otherwise
   from its category (table below), otherwise the Coding icon.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const categoryIcons = {
    "Web Development": "images/Icons/W Dev.png",
    "Mobile Development": "images/Icons/Ma Dev.png",
    "Mobile App Development": "images/Icons/Ma Dev.png",
    "Cybersecurity": "images/Icons/Cybersecurity.png",
    "Artificial Intelligence": "images/Icons/AI.png",
    "AI": "images/Icons/AI.png",
    "Cloud Computing": "images/Icons/Cl com.png",
    "Cloud Development": "images/Icons/C Dev.png",
    "Machine Learning": "images/Icons/M L.png",
    "Digital Transformation": "images/Icons/D T.png",
    "Data Transformation": "images/Icons/Data T.png",
    "Networking": "images/Icons/Networking.png",
    "Networking & IT Infrastructure": "images/Icons/N IT.png",
    "IT Infrastructure": "images/Icons/N IT.png",
    "Software Development": "images/Icons/Sft Dev.png",
    "Coding": "images/Icons/Coding.png"
  };
  const defaultIcon = "images/Icons/Coding.png";

  const grid = document.getElementById("coursesGrid");
  const loading = document.getElementById("coursesLoading");
  const empty = document.getElementById("catalogEmpty");

  try {
    const response = await fetch("https://iuex-globe-net-backend.onrender.com/api/courses");
    const courses = await response.json();

    loading.style.display = "none";
    if (courses.length === 0) return;

    grid.innerHTML = courses.map((c) => `
      <div class="course-card">
        <div class="course-image">
                <img src="${c.imageUrl || categoryIcons[c.category] || defaultIcon}" alt="${c.title}">
        </div>
        <h3>${c.title}</h3>
        <p class="course-category">${c.category}</p>
        <p class="course-description">${c.description}</p>
        <div class="course-meta">
          <span class="course-badge">Coming Soon</span>
          <span class="course-duration">${c.duration || ""}</span>
        </div>
        <span class="course-level">${c.level}</span>
      </div>
    `).join("");

    grid.style.display = "grid";
    empty.style.display = "none";
  } catch (error) {
    loading.style.display = "none";
    console.error("Could not load courses:", error);
  }
});