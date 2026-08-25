document.addEventListener("DOMContentLoaded", async () => {
  const coursesGrid = document.getElementById("coursesGrid");
  const catalogEmpty = document.getElementById("catalogEmpty");

  try {
   const response = await fetch("https://iuex-globe-net-backend.onrender.com/api/courses");
    const courses = await response.json();

    if (courses.length === 0) {
      // No courses yet — keep showing "Courses Launching Soon"
      return;
    }

    // Real courses exist — build and show the grid
    coursesGrid.innerHTML = courses.map(course => `
      <div class="course-card">
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
    // If backend isn't reachable, just keep showing "Courses Launching Soon"
    console.error("Could not load courses:", error);
  }
});