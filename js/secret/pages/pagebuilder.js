export { PageBuilder };

class PageBuilder {
  constructor(dataFiles) {
    this.globalSettings = { den: "Default", create: "Yes", parent: "Bio" };
    this.currentPage = "home"; //home -> upload -> questions -> download; home -> settings; home -> instructions;
    this.heir = null;
    this.globalRelatives = [];
    this.contentArea = document.querySelector("#content");
    this.save = '{"key": "value"}';
    this.colors = [];
    this.objectsToBuild = [];
    this.dataFiles = dataFiles; //object with all JSON templates (meta, lang, etc) and images the program will need
  }
  createButton = (direction) => {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    if (direction == "next") {
      button.classList.add("next");
      button.innerHTML = "Next >";
      button.addEventListener("click", () => this.pageChange("next"));
    } else if (direction == "back") {
      button.classList.add("back");
      button.innerHTML = "< Back";
      button.addEventListener("click", () => this.pageChange("back"));
    } else {
      button.innerHTML = direction;
    }
    return button;
  };
  pageChange = (direction) => {
    //home -> upload -> questions -> download; home -> settings; home -> instructions;
    if (direction == "next") {
      switch (this.currentPage) {
        case "home":
          this.uploadPage();
          break;
        case "upload":
          this.questionsPage();
          break;
        case "questions":
          //this.updateData(); called manually because of the order things have to process in upon leaving this page
          this.downloadPage();
          break;
        default:
          this.homePage();
      }
    }
    //questions & dl will probably end up either having restart buttons or no buttons but for now ill keep them like this
    else if (direction == "back") {
      switch (this.currentPage) {
        case "settings":
          this.updateData();
          this.homePage();
          break;
        case "questions":
          this.updateData();
          this.uploadPage();
          break;
        case "download":
          this.questionsPage();
          break;
        default:
          this.homePage();
      }
    }
  };
  updateData = () => {
    if (this.currentPage == "settings") {
      //https://stackoverflow.com/questions/44961780/store-data-from-html-radio-buttons-into-javascript-array
      this.globalSettings.den = document.querySelector('[name="setting-1"]:checked').value; //will select whatever option is selected in the set of options named "setting-1"
      this.globalSettings.create = document.querySelector('[name="setting-2"]:checked').value;
      this.globalSettings.parent = document.querySelector('[name="setting-3"]:checked').value;
    } else if (this.currentPage == "questions") {
      this.heir = document.querySelector('[name="heir"]:checked').value.toLowerCase();
      this.globalRelatives = Array.from(document.querySelectorAll('[name="relatives"]:checked')).map((element) => element.value);
      for (let i in this.globalRelatives) {
        this.globalRelatives[i] = this.globalRelatives[i].toLowerCase();
      }
      console.log(`The heir has been set to ${this.heir}`);
      console.log(`The relatives have been set to ${this.globalRelatives}`);
    }
  };
  reset = () => {
    this.heir = 0;
    this.relatives = [];
    this.save = '{"key": "value"}';
    this.colors = [];
  };
}
