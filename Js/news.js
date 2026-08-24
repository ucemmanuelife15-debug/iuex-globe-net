// news.js — IUEX Globe.Net News Section

const newsData = [
  {
    category: "product",
    title: "ELink Launching December 2026",
    description:
      "ELink, our professional networking and job ecosystem app, is set to launch in December 2026. We'll get in touch with you here for any further information, changes, or launch postponements.",
    date: "Updated: Jul 2026",
    icon: "images/Logo/Elink logo without name.png"
  },
  {
    category: "product",
    title: "ERoute Launching Early 2027",
    description:
      "ERoute, our smart travel and booking platform, is scheduled to launch in early 2027. We'll get in touch with you here for any further information, changes, or launch postponements.",
    date: "Updated: Jul 2026",
    icon: "images/Logo/Eroute logo without name.png"
  },
  {
    category: "company",
    title: "IUEX Globe.Net Expands Its Tech Ecosystem",
    description:
      "We're growing our lineup of digital products and services as we continue building Africa's next-generation technology ecosystem.",
    date: "Updated: Jul 2026",
    icon: "svg-company"
  },
  {
    category: "announcement",
    title: "Coding Courses Coming Soon",
    description:
      "Our coding academy is in final preparation. Practical courses in web, mobile, AI, and cloud development will be announced here first.",
    date: "Updated: Jul 2026",
    icon: "svg-announcement"
  }
];

// Inline SVGs for categories without a dedicated icon yet
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

  const filtered =
    filter === "all" ? newsData : newsData.filter((item) => item.category === filter);

  grid.innerHTML = filtered
    .map((item) => {
      const iconHTML = item.icon.startsWith("svg-")
        ? `<div class="news-icon">${svgIcons[item.icon]}</div>`
        : `<img src="${item.icon}" alt="${item.title}" class="news-icon">`;

      return `
        <div class="news-card">
          ${iconHTML}
          <span class="news-tag ${item.category}">${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <span class="news-date">${item.date}</span>
        </div>
      `;
    })
    .join("");
}

// Filter button logic
document.addEventListener("DOMContentLoaded", () => {
  renderNews();

  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderNews(btn.dataset.filter);
    });
  });
});