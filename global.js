document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("adminAuthenticated")) {
    window.location.href = "../admin-login.html";
    return;
  }

  // Auto-highlight active navbar link based on current filename
  const currentPath = window.location.pathname.split("/").pop() || "dashboard.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Dark / Light Theme Mode Toggle
  const themeBtn = document.getElementById("theme-btn");
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "dark";
  htmlEl.setAttribute("data-theme", savedTheme);
  updateThemeButton(themeBtn, savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = htmlEl.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      htmlEl.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeButton(themeBtn, newTheme);
    });
  }
});

function updateThemeButton(button, theme) {
  if (!button) return;
  const isDark = theme === "dark";
  button.setAttribute("aria-checked", String(isDark));
  button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function logoutAdmin(event) {
  event.preventDefault();
  localStorage.removeItem("adminAuthenticated");
  window.location.href = "../admin-login.html";
}

// Modal Helper Functions
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("open");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("open");
}