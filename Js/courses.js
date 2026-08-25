document.addEventListener("DOMContentLoaded", async () => {
    const categoryImages = {
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
    "Coding": "images/Icons/Coding.png",
  };

  const fallbackImage = "images/Icons/Coding.png";
  const coursesGrid = document.getElementById("coursesGrid");
    const coursesLoading = document.getElementById("coursesLoading");
  const catalogEmpty = document.getElementById("catalogEmpty");

  try {
   const response = await fetch("https://iuex-globe-net-backend.onrender.com/api/courses");
    const courses = await response.json();

       coursesLoading.style.display = "none";

    if (courses.length === 0) {
      // No courses yet — keep showing "Courses Launching Soon"
      return;
    }

    // Real courses exist — build and show the grid
        coursesGrid.innerHTML = courses.map(course => `
      <div class="course-card">
        <div class="course-image">
                <img src="${course.imageUrl || categoryImages[course.category] || fallbackImage}" alt="${course.title}">
        </div>
        <h3>${course.title}</h3>
        <p class="course-category">${course.category}</p>
        <p class="course-description">${course.description}</p>
        <div class="course-meta">
          <span class="course-badge">Coming Soon</span>
          <span class="course-duration">${course.duration || ""}</span>
        </div>
        <span class="course-level">${course.level}</span>
      </div>
    `).join("");

    coursesGrid.style.display = "grid";
    catalogEmpty.style.display = "none";

    } catch (error) {
    coursesLoading.style.display = "none";
    console.error("Could not load courses:", error);
  }
});