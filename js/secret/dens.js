//https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export class Den {
  constructor(denName, heir, globalSettings, save, files, collateral) {
    this.dataFiles = files;
    this.denName = denName;
    this.globalSettings = globalSettings;
    this.heir = heir;
    this.save = save;
    this.files = null; //"Test/1/1.txt": save.player_name  -- structure
    this.parent = getParentSituation(this.heir, this.save, globalSettings.create);
    this.langName = this.getLangName();
    this.collateral = collateral; //Building that will be deleted to make up for this one's creation; usually a spouse moving in
  }
  getFile(files, folders, name, ext) {
    return files[`dens/${folders}${name}.${ext}`];
  }
  getLangName() {
    switch (this.denName) {
      case "alabasterden":
        return "Alabaster and Fliss's Den";
      case "bobden":
        return "Bob and Buttercup's Den";
      case "elliden":
        return "Elli and Champ's Den";
      case "krampyden":
        return "Jack's Clinic";
      case "auroraandluxden":
        return "Aurora and Lux's Den";
      case "siblingoneden":
        return this.parent == "one" ? `${this.save.kitten_one_name} and ${this.save.player_name}'s Den` : `${this.save.kitten_one_name}'s Den`;
      case "siblingtwoden":
        return `${this.save.kitten_two_name}'s Den`;
      case "siblingthreeden":
        return `${this.save.kitten_three_name}'s Den`;
      case "siblingfourden":
        return this.parent == "four" ? `${this.save.kitten_four_name} and ${this.save.player_name}'s Den` : `${this.save.kitten_four_name}'s Den`;
    }
  }
  getDecorName() {
    switch (this.denName) {
      case "emberandsparkden":
        return "decor_shop";
      case "krampyden":
        return "decor_clinic";
      default:
        return `decor_${this.denName.replace("den", "")}`;
    }
  }
  getFileName() {
    if (this.denName.startsWith("sibling")) {
      let newDenName = `${this.denName}-`;
      if (this.globalSettings.den == "Outdoor") {
        newDenName += "O";
      } else if (this.globalSettings.den == "Indoor") {
        newDenName += "I";
      } else if (this.globalSettings.den == "Default") {
        if (this.denName.startsWith("siblingone")) {
          newDenName += "I";
        } else if (this.denName.startsWith("siblingtwo")) {
          newDenName += "O";
        } else if (this.denName.startsWith("siblingthree")) {
          newDenName += "I";
        } else if (this.denName.startsWith("siblingfour")) {
          newDenName += "O";
        }
      }
      if (this.denName.startsWith("siblingone") && this.parent == "one") {
        newDenName += "P";
      } else if (this.denName.startsWith("siblingfour") && this.parent == "four") {
        newDenName += "P";
      }
      return newDenName;
    } else {
      return this.denName;
    }
  }
}

export const getParentSituation = (heir, save, parentSetting) => {
  // RULES:
  // First, ensure parent exists.
  // If parent is currently married, parent will live with their partner.
  // If parent is divorced, they will move in with a child.
  // Parent will move in with sibling one UNLESS the heir is sibling one
  // If the heir is sibling one, parent will move in with sibling four

  let parentExists = parentSetting == "Yes" ? true : false;
  if (parentExists) {
    let spouse = save.most_recent_spouse_uid;
    save.npcs[spouse].is_married == ("1.0" || "1" || "true") ? (spouse = spouse) : (spouse = null);
    if (!spouse) {
      return heir == "one" ? "four" : "one";
    } else {
      return spouse;
    }
  } else {
    return "dne"; //does not exist
  }
};
