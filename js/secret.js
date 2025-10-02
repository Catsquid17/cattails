"use strict";

const start = document.querySelector("#start");
const left = document.querySelector("#left-section");
const right = document.querySelector("#right-section");
let globalSettings = {"one": null, "two": null, "three": null};
let currentPage = 1;

start.addEventListener("click", () => toPage2());

const updateData = () => {
  if (currentPage == 2) {
    //making this code react to how many settings there are is way too much work for a program that will have maybe four
    //https://stackoverflow.com/questions/44961780/store-data-from-html-radio-buttons-into-javascript-array
    globalSettings.one = document.querySelector('[name="setting-1"]:checked').value //will select whatever option is selected in the set of options named "setting-1"
    globalSettings.two = document.querySelector('[name="setting-2"]:checked').value
    globalSettings.three = document.querySelector('[name="setting-3"]:checked').value
    }
}

const toPage1 = () => {
  currentPage = 1;
  left.innerHTML = "";
  right.innerHTML = "";
  let button = createButton("start", "Next >");
  button.addEventListener("click", () => toPage2());
  right.appendChild(button);
}

const toPage2 = () => {
  currentPage = 2;
  left.innerHTML = "";
  //left.classList.remove('text-center'); will be useful for other pages but i think i like the center here
  let heading = document.createElement('h2');
  let paragraph = document.createElement('p');
  heading.innerHTML = "Settings";
  paragraph.innerHTML = "An explanation of what this page does. Lorem ipsum lorem ipsum lorem ipsum or whatever";
  left.appendChild(heading);
  left.appendChild(paragraph);
  //-----
  right.innerHTML = "";
  let settings = [["Cat", "Dog", "Horse"], ["One", "Two"], ["Yes", "No"]];
  let settingTexts = ["Which animal?", "Which number?", "Yes or no?"];
  let numSettings = 0;
  let br = document.createElement('br');
  let input = document.createElement('input');

  for (let setting of settings) {
    numSettings++;
    let settingText = document.createElement('p');
    settingText.innerHTML = settingTexts[numSettings-1]
    right.appendChild(settingText);
    
    input.setAttribute("type", "radio");
    input.setAttribute("name", `setting-${numSettings}`);

    let numOptions = 0;
    for (let option of setting) {
      let opt = input.cloneNode(true);
      let lineBreak = br.cloneNode()
      opt.setAttribute("id", option.toLowerCase());
      opt.setAttribute("value", option);
      if (globalSettings.one == null && numOptions == 0) {
        opt.checked = true; //first option should be selected by default
      }
      else if ((numSettings == 1 && option == globalSettings.one) || (numSettings == 2 && option == globalSettings.two) || (numSettings == 3 && option == globalSettings.three)) {
        //if we're looking at setting1 and setting1 = the name of this option, make it checked
        opt.checked = true;
      }
      
      let label = document.createElement('label');
      label.setAttribute("for", option.toLowerCase());
      label.innerHTML = option;

      right.appendChild(opt);
      right.appendChild(label);
      right.appendChild(lineBreak);
      numOptions++;
    }
  }
  let backButton = createButton("2to1", "< Back");
  backButton.addEventListener("click", () => toPage1());
  right.appendChild(backButton);
  let nextButton = createButton("2to3", "Next >");
  nextButton.addEventListener("click", () => toPage3());
  right.appendChild(nextButton);
}

const toPage3 = () => {
  updateData(); //this goes here because the original setting values are null, if we made it so the values update on change, they wouldnt store the value if the user didnt change anything
  console.log(globalSettings)
  currentPage = 3;
  left.innerHTML = "";
  right.innerHTML = "";
  let button = createButton("3to2", "< Back");
  button.addEventListener("click", () => toPage2());
  right.appendChild(button);
}

const createButton = (id, text) => {
    let button = document.createElement('button');
    button.setAttribute("type", "button");;
    button.classList.add("btn");
    button.classList.add("btn-primary");
    //button.classList.add("btn-lg");
    button.setAttribute("id", id);
    button.innerHTML = text;
    return button;
}
//element.innerHTML = "blah";
//element.classList.add()
//element.setAttribute("href", "hi.com")
//parent = element.parentNode

//thoughts:
//im going to want more meaningful setting names than one/two/three, but i can just update the settings definition and key-value assignment once i have those names. idc about the html page names
