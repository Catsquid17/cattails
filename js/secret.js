"use strict";

const start = document.querySelector("#start");
const left = document.querySelector("#left-section");
const right = document.querySelector("#right-section");

start.addEventListener("click", () => toPage2());

const toPage2 = () => {
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
  let numSettings = 0;

  for (let setting of settings) {
    console.log(`setting: ${setting}`)
    numSettings++;
    let input = document.createElement('input');
    input.setAttribute("type", "radio");
    input.setAttribute("name", `setting-${numSettings}`);

    let numOptions = 0;
    for (let option of setting) {
      console.log(`option: ${option}`)
      
      let opt = input.cloneNode(true);
      opt.setAttribute("id", option.toLowerCase());
      opt.setAttribute("value", option);
      
      let label = document.createElement('label');
      label.setAttribute("for", option.toLowerCase());
      label.innerHTML = option;

      right.appendChild(opt);
      right.appendChild(label);
      numOptions++;
    }
  }
  
}

//element.innerHTML = "blah";
//element.classList.add()
//element.setAttribute("href", "hi.com")
//parent = element.parentNode
