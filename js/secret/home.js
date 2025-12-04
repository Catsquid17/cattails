import { PageBuilder } from "./pagebuilder.js";

PageBuilder.prototype.homePage = function () {
  this.currentPage = "home";
  this.contentArea.innerHTML = "";
  this.contentArea.setAttribute("id", "home");

  let image = document.createElement("img");
  let paragraph = document.createElement("p");
  let start = this.createButton("next");
  let settings = this.createButton("Settings");
  let instructions = document.createElement("a");

  paragraph.innerHTML = "This is a blurb explaining all about my super cool super awesome super secret project! Oh boy I sure do hope I finish it someday. Maybe late 2026 if I'm lucky";
  image.setAttribute("src", "https://placehold.co/400");
  image.setAttribute("alt", "Sample Image");
  image.setAttribute("title", "Sample Image");
  image.setAttribute("width", "400");
  image.setAttribute("height", "400");
  image.setAttribute("id", "home-img");
  start.innerHTML = "Start";
  start.classList.remove("next");
  settings.addEventListener("click", () => this.settingsPage());
  instructions.innerHTML = "Instructions"
  instructions.setAttribute("href", "https://catsquid17.github.io/cattails/secret/instructions.html");
  instructions.classList.add("btn");
  instructions.classList.add("btn-primary");

  let menu = document.createElement("ul");
  menu.setAttribute("id", "button-list");
  let buttons = [start, settings, instructions];
  for (let button of buttons) {
    let item = document.createElement("li");
    item.appendChild(button);
    menu.append(item);
  }

  this.contentArea.appendChild(image);
  this.contentArea.appendChild(paragraph);
  this.contentArea.appendChild(menu);
};
