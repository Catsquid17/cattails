"use strict";

let globalSettings = {"den": "Default", "create": "Conditionally", "parent": "Bio"};
let currentPage = "home"; //home -> upload -> questions -> download; home -> settings; home -> instructions;
let contentArea = document.querySelector("#content");

window.onload = function() {
  homePage();
};

const homePage = () => {
  currentPage = "home";
  contentArea.innerHTML = "";
  
  let left = document.createElement('div');
  let right = document.createElement('div');
  left.classList.add("col-md-4");
  left.classList.add("text-center");
  right.classList.add("col-md-8");

  let image = document.createElement('img');
  let paragraph = document.createElement('p');
  let start = createButton("next");
  let settings = createButton("Settings");
  let instructions = createButton("Instructions");

  paragraph.innerHTML = "This is a blurb explaining all about my super cool super awesome super secret project! Oh boy I sure do hope I finish it someday. Maybe late 2026 if I'm lucky";
  image.setAttribute("src", "https://placehold.co/400");
  image.setAttribute("alt", "Sample Image");
  image.setAttribute("title", "Sample Image");
  image.setAttribute("width", "400");
  image.setAttribute("height", "400");
  start.innerHTML = "Start";
  settings.addEventListener("click", () => settingsPage());
  instructions.addEventListener("click", () => instructionsPage());
  
  left.appendChild(image);
  right.appendChild(paragraph);
  right.appendChild(start);
  right.appendChild(settings);
  right.appendChild(instructions);

  contentArea.appendChild(left);
  contentArea.appendChild(right);
}

const settingsPage = () => {
  currentPage = "settings";
  contentArea.innerHTML = "";

  let heading = document.createElement('h2');
  let paragraph = document.createElement('p');
  heading.innerHTML = "Settings";
  paragraph.innerHTML = "These settings do not save between instances of the program, so be careful! Could I save them? Yeah probably. But you're not supposed to use this every day and there are a whole Three settings. So I'm not going to";
  contentArea.appendChild(heading);
  contentArea.appendChild(paragraph);
  
  let settings = [["Default", "Indoor", "Outdoor"], ["Conditionally", "Always", "Never"], ["Bio", "Step"]];
  let settingTexts = ["Den?", "Create?", "Parent?"];
  let numSettings = 0;
  let br = document.createElement('br');
  let input = document.createElement('input');

  for (let setting of settings) {
    numSettings++;
    let settingText = document.createElement('p');
    settingText.innerHTML = settingTexts[numSettings-1]
    contentArea.appendChild(settingText);
    
    input.setAttribute("type", "radio");
    input.setAttribute("name", `setting-${numSettings}`);

    let numOptions = 0;
    for (let option of setting) {
      let opt = input.cloneNode(true);
      let lineBreak = br.cloneNode()
      opt.setAttribute("id", option.toLowerCase());
      opt.setAttribute("value", option);
      if (globalSettings.den == null && numOptions == 0) {
        opt.checked = true; //first option should be selected by default
      }
      else if ((numSettings == 1 && option == globalSettings.den) || (numSettings == 2 && option == globalSettings.create) || (numSettings == 3 && option == globalSettings.parent)) {
        //if we're looking at setting1 and setting1 = the name of this option, make it checked
        opt.checked = true;
      }
      
      let label = document.createElement('label');
      label.setAttribute("for", option.toLowerCase());
      label.innerHTML = option;

      contentArea.appendChild(opt);
      contentArea.appendChild(label);
      contentArea.appendChild(lineBreak);
      numOptions++;
    }
  }
  
  let back = createButton("back");
  let next = createButton("next");
  contentArea.appendChild(back);
  contentArea.appendChild(next);
}

const instructionsPage = () => {
  currentPage = "instructions";
  contentArea.innerHTML = "";

  console.log(currentPage);
  
  let back = createButton("back");
  contentArea.appendChild(back);
}

const uploadPage = () => {
  currentPage = "upload";
  contentArea.innerHTML = "";

  console.log(currentPage);
  
  let back = createButton("back");
  let next = createButton("next");
  contentArea.appendChild(back);
  contentArea.appendChild(next);
}

const questionsPage = () => {
  currentPage = "questions";
  contentArea.innerHTML = "";

  console.log(currentPage);
  
  let back = createButton("back");
  let next = createButton("next");
  contentArea.appendChild(back);
  contentArea.appendChild(next);
}

const downloadPage = () => {
  currentPage = "download";
  contentArea.innerHTML = "";

  console.log(currentPage);
  
  let back = createButton("back");
  let next = createButton("next");
  contentArea.appendChild(back);
  contentArea.appendChild(next);
}

const createButton = (direction) => {
  let button = document.createElement('button');
  button.setAttribute("type", "button");
  button.classList.add("btn");
  button.classList.add("btn-primary");
  if (direction == "next") {
    button.innerHTML = "Next >";
    button.addEventListener("click", () => pageChange("next"));
  }
  else if (direction == "back") {
    button.innerHTML = "< Back";
    button.addEventListener("click", () => pageChange("back"));
  }
  else {
    button.innerHTML = direction;
  }
  return button;
}

const pageChange = (direction) => {
  //home -> upload -> questions -> download; home -> settings; home -> instructions;
  if (direction == "next") {
    switch (currentPage) {
      case "home":
        uploadPage();
      case "upload":
        questionsPage();
      case "questions":
        downloadPage();
      default:
        homePage();
    }
  }
  //questions & dl will probably end up either having restart buttons or no buttons but for now ill keep them like this
  else if (direction == "back") {
    switch (currentPage) {
      case "settings":
        homePage();
        updateData();
        console.log(globalSettings);
      case "questions":
        uploadPage();
      case "download":
        questionsPage();
      default:
        homePage();
    }
  }
}

const updateData = () => {
  if (currentPage == "settings") {
    //making this code react to how many settings there are is way too much work for a program that will have maybe four
    //https://stackoverflow.com/questions/44961780/store-data-from-html-radio-buttons-into-javascript-array
    globalSettings.den = document.querySelector('[name="setting-1"]:checked').value //will select whatever option is selected in the set of options named "setting-1"
    globalSettings.create = document.querySelector('[name="setting-2"]:checked').value
    globalSettings.parent = document.querySelector('[name="setting-3"]:checked').value
    }
}

//element.innerHTML = "blah";
//element.classList.add()
//element.setAttribute("href", "hi.com")
//parent = element.parentNode
