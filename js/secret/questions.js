import { PageBuilder } from "./pagebuilder.js";

PageBuilder.prototype.questionsPage = function () {
  this.currentPage = "questions";
  this.contentArea.innerHTML = "";
  this.contentArea.setAttribute("id", "questions");

  let heading = document.createElement('h2');
  let paragraph = document.createElement('p');
  heading.innerHTML = "Questions";
  paragraph.innerHTML = "I have questions for you";
  this.contentArea.appendChild(heading);
  this.contentArea.appendChild(paragraph);

  let npcs = ["Krampy", "Coco", "Jag", "Champ", "Alabaster", "Bob", "Talon", "Phantom", "Falcon", "Garlic", "Ember", "Elli", "Buttercup", "Spark", "Lainey", "Fliss", "Glimmer", "Charlotte", "Rosemary", "Zephyr", "Umbra", "The Forest Guardian", "The Wildwood Champion"]
  let settings = [["One", "Two", "Three", "Four"], npcs];
  let settingLabels = [[this.save.kitten_one_name, this.save.kitten_two_name, this.save.kitten_three_name, this.save.kitten_four_name], npcs];
  let settingTexts = ["Who?", "Who?"];
  let numSettings = 0;
  let br = document.createElement('br');
  let input = document.createElement('input');

  for (let setting of settings) {
    numSettings++;
    let settingText = document.createElement('p');
    let strong = document.createElement('strong');
    strong.innerHTML = settingTexts[numSettings-1]
    settingText.appendChild(strong);
    this.contentArea.appendChild(settingText);

    if (numSettings == 2) {
      input.setAttribute("type", "checkbox");
      input.setAttribute("name", "relatives");
    } else {
      input.setAttribute("type", "radio");
      input.setAttribute("name", "heir");
    }

    let numOptions = 0;
    for (let option of setting) {
      let opt = input.cloneNode(true);
      let lineBreak = br.cloneNode()
      opt.setAttribute("id", option.toLowerCase().replace(" ", "_"));
      opt.setAttribute("value", option);
      if ((numSettings == 1 && option == this.heir) || (numSettings == 2 && this.relatives.includes(option))) {
        //if we're looking at setting1 and setting1 = the name of this option, make it checked
        opt.checked = true;
      }
      
      let label = document.createElement('label');
      label.setAttribute("for", option.toLowerCase().replace(" ", "_"));
      label.innerHTML = settingLabels[numSettings-1][numOptions];

      this.contentArea.appendChild(opt);
      this.contentArea.appendChild(label);
      this.contentArea.appendChild(lineBreak);
      numOptions++;
    }
  }
  
  let back = this.createButton("back");
  let next = this.createButton("next");
  next.disabled = true; //disable by default

  document.addEventListener("change", () => {
    //enable next button when option is selected
    if (document.querySelector('[name="heir"]:checked')) {
      next.disabled = false;
    }
  });

  this.contentArea.appendChild(back);
  this.contentArea.appendChild(next);
}