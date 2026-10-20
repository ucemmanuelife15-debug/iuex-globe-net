/* =====================================================================
   NEWS & ANNOUNCEMENTS  (restored from your original file)
   To add a story: copy one { ... } block inside newsData, paste it
   under the last one (keep a comma between blocks) and change the words.
   category: "product" | "company" | "announcement"
   icon: a picture path, OR "svg-company" / "svg-announcement" for the built-in icons
   ===================================================================== */
const newsData = [
  {
    category: "product",
    title: "ELink Launching December 2026",
    description: "ELink, our professional networking and job ecosystem app, is set to launch in December 2026. We'll get in touch with you here for any further information, changes, or launch postponements.",
    date: "Updated: Jul 2026",
    icon: "images/Logo/Elink logo without name.png"
  },
  {
    category: "product",
    title: "ERoute Launching Early 2027",
    description: "ERoute, our smart travel and booking platform, is scheduled to launch in early 2027. We'll get in touch with you here for any further information, changes, or launch postponements.",
    date: "Updated: Jul 2026",
    icon: "images/Logo/Eroute logo without name.png"
  },
  {
    category: "company",
    title: "IUEX Globe.Net Expands Its Tech Ecosystem",
    description: "We're growing our lineup of digital products and services as we continue building Africa's next-generation technology ecosystem.",
    date: "Updated: Jul 2026",
    icon: "svg-company"
  },
  {
    category: "announcement",
    title: "Coding Courses Coming Soon",
    description: "Our coding academy is in final preparation. Practical courses in web, mobile, AI, and cloud development will be announced here first.",
    date: "Updated: Jul 2026",
    icon: "svg-announcement"
  }
];

const svgIcons = {
  "svg-company": `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21V7l9-4 9 4v14H3z" stroke="#1aa361" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M9 21v-6h6v6" stroke="#1aa361" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="12" cy="11" r="1.5" fill="#1aa361"/>
    </svg>`,
  "svg-announcement": `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 11v2a2 2 0 002 2h1l3 5v-5h2l7 4V5l-7 4H6a2 2 0 00-2 2z" stroke="#d9631e" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`
};

function renderNews(filter = "all") {
  const grid = document.getElementById("news-grid");
  if (!grid) return;

  const items = filter === "all" ? newsData : newsData.filter(n => n.category === filter);

  grid.innerHTML = items.map(n => {
    const iconHtml = n.icon.startsWith("svg-")
      ? '<div class="news-icon">' + svgIcons[n.icon] + '</div>'
      : '<img src="' + n.icon + '" alt="' + n.title + '" class="news-icon">';

    return `
        <div class="news-card">
          ${iconHtml}
          <span class="news-tag ${n.category}">${n.category}</span>
          <h3>${n.title}</h3>
          <p>${n.description}</p>
          <span class="news-date">${n.date}</span>
        </div>
      `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderNews();

  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderNews(btn.dataset.filter);
    });
  });
});