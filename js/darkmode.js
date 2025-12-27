const darkModeBtn = document.getElementById("dark-mode");
const darkModeBtnNav = document.getElementById("dark-mode-nav");
localStorage.theme = localStorage.theme == null ? "light" : localStorage.theme; //use theme if one is stored, otherwise default to light mode

//https://stackoverflow.com/questions/41370741/how-do-i-edit-a-css-variable-using-js
const lightMode = () => {
  const darkModeBtn = document.getElementById("dark-mode");
  localStorage.theme = "light";
  document.documentElement.style.setProperty("--bg-color", "#e7d0c4");
  document.documentElement.style.setProperty("--text-color", "#865b49");
  document.documentElement.style.setProperty("--accent-color", "#442827");
  document.documentElement.style.setProperty("--accent-text-color", "#f3e8df");
  document.documentElement.style.setProperty("--button-hover-text-color", "#f3e8df");
  darkModeBtn.textContent = "🌙";
  darkModeBtn.style.setProperty("font-size", "28px");
  darkModeBtn.setAttribute("aria-label", "Switch to dark mode");
};

const darkMode = () => {
  const darkModeBtn = document.getElementById("dark-mode");
  localStorage.theme = "dark";
  document.documentElement.style.setProperty("--bg-color", "#442827");
  document.documentElement.style.setProperty("--text-color", "#dfc2b3");
  document.documentElement.style.setProperty("--accent-color", "#251313");
  document.documentElement.style.setProperty("--accent-text-color", "#f3e8df");
  document.documentElement.style.setProperty("--button-hover-text-color", "#442827");
  darkModeBtn.textContent = "☀️";
  darkModeBtn.style.setProperty("font-size", "30px");
  darkModeBtn.setAttribute("aria-label", "Switch to light mode");
};

const swapModes = () => {
  document.body.style.setProperty("transition", "0.6s ease"); //added here so you dont see fade-in on reload
  if (localStorage.theme == "light") {
    //if theme is light, swap to dark
    darkMode();
  } else {
    //if theme is dark, swap to light
    lightMode();
  }
};
const loadMode = () => {
  if (localStorage.theme == "light") {
    //if theme is light, load light theme
    lightMode();
  } else {
    //if theme is dark, load dark theme
    darkMode();
  }
};

darkModeBtn.addEventListener("click", () => {
  swapModes();
});
darkModeBtnNav.addEventListener("click", () => {
  swapModes();
});

document.addEventListener("DOMContentLoaded", () => {
  loadMode();
});
