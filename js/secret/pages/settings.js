import { PageBuilder } from "./pagebuilder.js";

PageBuilder.prototype.settingsPage = function () {
  this.currentPage = "settings";
  this.contentArea.innerHTML = "";
  this.contentArea.setAttribute("id", "settings");

  let heading = document.createElement("h2");
  let paragraph = document.createElement("p");
  heading.innerHTML = "Settings";
  paragraph.innerHTML = "These settings do not save between instances of the program, so be careful! Could I save them? Yeah probably. But you're not supposed to use this every day and there are a whole Three settings. So I'm not going to";
  this.contentArea.appendChild(heading);
  this.contentArea.appendChild(paragraph);

  let settings = [ ["Default", "Indoor", "Outdoor"], ["Yes", "No"], ["Bio", "Step"] ];
  let settingTexts = ["Den?", "Create?", "Parent?"];
  let numSettings = 0;
  let br = document.createElement("br");
  let input = document.createElement("input");

  for (let setting of settings) {
    numSettings++;
    let settingText = document.createElement("p");
    let strong = document.createElement("strong");
    strong.innerHTML = settingTexts[numSettings - 1];
    settingText.appendChild(strong);
    this.contentArea.appendChild(settingText);

    input.setAttribute("type", "radio");
    input.setAttribute("name", `setting-${numSettings}`);

    let numOptions = 0;
    for (let option of setting) {
      let opt = input.cloneNode(true);
      let lineBreak = br.cloneNode();
      opt.setAttribute("id", option.toLowerCase());
      opt.setAttribute("value", option);
      if (this.globalSettings.den == null && numOptions == 0) {
        opt.checked = true; //first option should be selected by default
      } else if ((numSettings == 1 && option == this.globalSettings.den) || (numSettings == 2 && option == this.globalSettings.create) || (numSettings == 3 && option == this.globalSettings.parent)) {
        //if we're looking at setting1 and setting1 = the name of this option, make it checked
        opt.checked = true;
      }

      let label = document.createElement("label");
      label.setAttribute("for", option.toLowerCase());
      label.innerHTML = option;

      this.contentArea.appendChild(opt);
      this.contentArea.appendChild(label);
      this.contentArea.appendChild(lineBreak);
      numOptions++;
    }
  }

  let back = this.createButton("back");
  this.contentArea.appendChild(back);
};
