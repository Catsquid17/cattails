import { PageBuilder } from "./pagebuilder.js";
import { Sibling, NewRivalKitten } from "../cats.js";

//TODO: detect relatives & disable the boxes

PageBuilder.prototype.questionsPage = function () {
  this.currentPage = "questions";
  this.contentArea.innerHTML = "";
  this.contentArea.setAttribute("id", "questions");

  let heading = document.createElement("h2");
  let paragraph = document.createElement("p");
  heading.innerHTML = "Questions";
  paragraph.innerHTML = "I have questions for you";
  this.contentArea.appendChild(heading);
  this.contentArea.appendChild(paragraph);

  //later, read save and append modded cats to this list (only important once mod support is added)
  let npcs = ["Krampy", "Coco", "Jag", "Champ", "Alabaster", "Bob", "Talon", "Phantom", "Garlic", "Ember", "Elli", "Buttercup", "Spark", "Lainey", "Fliss", "Glimmer", "Charlotte", "Rosemary", "Zephyr", "Umbra", "The Forest Guardian", "The Wildwood Champion"];
  let settings = [["One", "Two", "Three", "Four"], npcs];
  let settingLabels = [[this.save.kitten_one_name, this.save.kitten_two_name, this.save.kitten_three_name, this.save.kitten_four_name], npcs];
  let settingTexts = ["Who?", "Who?"];
  let numSettings = 0;
  let br = document.createElement("br");
  let input = document.createElement("input");

  //prepare to disable checkboxes for known relatives
  this.globalRelatives.push(this.save.kittens_parent);
  this.save.my_parent != "" ? this.globalRelatives.push(this.save.my_parent) : null; //add grandparent to list of relatives if one exists
  let relatedNPCs = [
    ["ember", "spark"],
    ["fliss", "lainey"],
  ];
  for (let relation of relatedNPCs) {
    //if ember is a relative, add spark as a relative if they are not already on the list
    if (this.globalRelatives.includes(relation[0])) {
      this.globalRelatives.includes(relation[1]) ? null : this.globalRelatives.push(relation[1]);
    }
    //if spark is a relative, add ember as a relative if they are not already on the list
    if (this.globalRelatives.includes(relation[1])) {
      this.globalRelatives.includes(relation[0]) ? null : this.globalRelatives.push(relation[0]);
    }
  }

  for (let setting of settings) {
    numSettings++;
    let settingText = document.createElement("p");
    let strong = document.createElement("strong");
    strong.innerHTML = settingTexts[numSettings - 1];
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
      let lineBreak = br.cloneNode();
      opt.setAttribute("id", option.toLowerCase().replace(" ", "_"));
      opt.setAttribute("value", option);
      if (numSettings == 1 && option == this.heir) {
        //if we're looking at setting1 and setting1 is set to the option we're drawing, make it checked
        opt.checked = true;
      }
      if (numSettings == 2 && this.globalRelatives.includes(option.toLowerCase())) {
        //if this cat is already known to be a relative, draw the box already checked (& disabled to prevent accidents)
        opt.checked = true;
        opt.disabled = true;
      }

      let label = document.createElement("label");
      label.setAttribute("for", option.toLowerCase().replace(" ", "_"));
      label.innerHTML = settingLabels[numSettings - 1][numOptions];

      this.contentArea.appendChild(opt);
      this.contentArea.appendChild(label);
      this.contentArea.appendChild(lineBreak);
      numOptions++;
    }
  }

  let back = this.createButton("back");
  let next = document.createElement("button"); //created manually because the processing needs to happen BEFORE the next page is built
  next.setAttribute("type", "button");
  next.classList.add("next");
  next.innerHTML = "Next >";
  next.disabled = true; //disable by default

  //after valid data is provided on this page, the program can finally process everything and prepare for it to be downloaded on the next page
  next.addEventListener("click", () => {
    this.updateData(); //manually update data to get correct heir
    document.body.style.cursor = "wait"; //the following could potentially take a minute
    next.disabled = true; //avoid double-clicks cause idk what would happen
    this.objectsToBuild = this.process();
    //make portraits
    for (let cat of this.objectsToBuild.catObjects) {
      //later include FRK
      if (cat instanceof Sibling || cat instanceof NewRivalKitten) {
        cat.createPortrait(this.dataFiles);
      }
    }
    this.pageChange("next"); //MUST be called after portraits finish being created, otherwise the user could proceed to download before that's done
    document.body.style.cursor = "default";
  });

  document.addEventListener("change", () => {
    //enable next button when option is selected
    if (document.querySelector('[name="heir"]:checked')) {
      next.disabled = false;
    }
  });

  //ensure that ember/spark and fliss/lainey are always checked in pairs
  let ember = document.querySelector("#ember");
  let spark = document.querySelector("#spark");
  let fliss = document.querySelector("#fliss");
  let lainey = document.querySelector("#lainey");
  ember.addEventListener("change", () => {
    ember.checked ? (spark.checked = true) : (spark.checked = false);
  });
  spark.addEventListener("change", () => {
    spark.checked ? (ember.checked = true) : (ember.checked = false);
  });
  fliss.addEventListener("change", () => {
    fliss.checked ? (lainey.checked = true) : (lainey.checked = false);
  });
  lainey.addEventListener("change", () => {
    lainey.checked ? (fliss.checked = true) : (fliss.checked = false);
  });

  this.contentArea.appendChild(back);
  this.contentArea.appendChild(next);
};
