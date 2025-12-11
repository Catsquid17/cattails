class Converter {
  constructor() {
    this.save = null;
    this.grid = null;
    this.furniture = null;
    this.styles = null;
  }
  uploadSave() {
    const fileMsg = document.getElementById("file-message");
    const button = document.getElementById("convert");
    const uploadFile = document.getElementById("user-file");
    fileMsg.innerHTML = "";
    button.disabled = true;

    var file = uploadFile.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (event) => {
      const contents = event.target.result;
      try {
        this.save = JSON.parse(`${contents.slice(0, contents.lastIndexOf("}")).trim()}}`); //parse to JSON. make sure it stops sending chars after last } because there may be an invisible char at the end of these files
        fileMsg.innerHTML = `File read successfully. This is ${this.save.player_name}'s file.`;
        button.disabled = false;
      } catch (error) {
        //likely the wrong kind of file
        fileMsg.innerHTML = "Error reading file!";
        console.log(error);
      }
    };
    reader.onerror = function (event) {
      fileMsg.innerHTML = "Error reading file!";
      console.log(event);
    };
  }
  convert() {
    if (this.save) {
      this.flipGrid();
      this.reformatFurniture();
      this.determineStyles();
      this.convertGrid();
      this.showResult();
    }
  }
  flipGrid() {
    let newGrid = [];
    let newRow = [];
    const oldGrid = this.save.player_den_grid;
    let i = 0;
    for (let column = 0; column < oldGrid.length; column++) {
      for (let row of oldGrid) {
        //row holds [0, 1, 2]
        newRow.push(row[i]); //push 0, then it will loop and push 3, then 6
      }
      newGrid.push(newRow);
      newRow = [];
      i++;
    }
    this.grid = newGrid;

    //bottom row can't be edited, always has 3 tiles that are not stored in save file
    let lastRow = this.grid.length - 1;
    this.grid[lastRow][14] = 1;
    this.grid[lastRow][15] = 1;
    this.grid[lastRow][16] = 1;
  }

  reformatFurniture() {
    let list = this.save.furniture_layout_list;

    let i = 0;
    for (let item of list) {
      for (let field of Object.keys(list[i])) {
        if (field == "direction") {
          switch (list[i][field]) {
            case 0:
            case 0.0:
              list[i][field] = "north";
              break;
            case 1:
            case 1.0:
              list[i][field] = "east";
              break;
            case 2:
            case 2.0:
              list[i][field] = "south";
              break;
            case 3:
            case 3.0:
              list[i][field] = "west";
              break;
          }
        }
      }
      i++;
    }

    this.furniture = list;
  }

  determineStyles() {
    let styleList = this.save.den_styles;
    let value = 1; //value to search for

    //NPC dens can only use one style. Pick the most used one.
    //rarely, style1 and style2 may look the same if the player set it up that way. take this into account when counting style usage.

    //count how many times each style is used
    let counts = [];
    let count = 0;
    for (let i = 1; i <= 6; i++) {
      count = 0;
      for (let row of this.grid) {
        for (let item of row) {
          if (item == i || item == `${i}.0`) {
            count++;
          }
        }
      }
      counts.push([i, count]);
    }

    //find any duplicate styles
    let dupes = [];
    for (let s1 in styleList) {
      for (let s2 in styleList) {
        if (styleList[s1][0] == styleList[s2][0] && styleList[s1][1] == styleList[s2][1] && s1 != s2) {
          dupes.push([s1, s2]); //index of original/first style, index of duplicate style
        }
      }
    }
    //remove any duplicate dupes (0,1 and 1,0 would have been added separately, but they're concerned with the same conflict)
    for (let s1 in dupes) {
      for (let s2 in dupes) {
        if (dupes[s1][0] == dupes[s2][1] && dupes[s1][1] == dupes[s2][0]) {
          dupes.splice(s2, 1);
        }
      }
    }

    //add values of duplicates to total counts
    for (let dupe of dupes) {
      counts[dupe[0]][1] += counts[dupe[1]][1];
      counts[dupe[1]][1] = 0; //ensures no extra values are created, important where there are 3+ dupes
    }

    //sorts so the style with most occurences is first; if they're the same, first occuring will be first
    counts.sort((a, b) => b[1] - a[1]);

    //counts[0][0] holds the number of style the den is going to use, like 1 for style1. but in the array, style 1 is at index 0, so subtract 1
    this.styles = styleList[counts[0][0] - 1];
    for (let i in this.styles) {
      this.styles[i] += 1;
    }
  }

  convertGrid() {
    //convert anything other than a 1 or 0 to a 1, remove decimals
    let countRow = 0;
    let countCol = 0;
    for (let row of this.grid) {
      countCol = 0;
      for (let item of row) {
        parseInt(item) >= 1 ? (item = 1) : (item = 0);
        this.grid[countRow][countCol] = item;
        countCol++;
      }
      countRow++;
    }
  }

  showResult() {
    const resultArea = document.getElementById("result");
    let result = JSON.parse(`{"npc_den_floor_style": null, "npc_den_wall_style": null, "npc_den_grid": null, "npc_den_furniture": null}`);
    result.npc_den_floor_style = this.styles[1];
    result.npc_den_wall_style = this.styles[0];
    result.npc_den_grid = this.grid;
    result.npc_den_furniture = this.furniture;

    result = JSON.stringify(result);
    result = result.replaceAll('"npc_', '\n\t\t"npc_').replaceAll("[", "\n\t\t\t[").replaceAll('{"', '\n\t\t\t{"'); //important formatting
    result = result.replaceAll(":", ": ").replaceAll(": \n\t\t\t[", ": [").replaceAll("]],", "]\n\t\t],").replaceAll('{\n\t\t"npc', '\t\t"npc').replaceAll("}]}", "}\n\t\t],"); //superfluous formatting

    resultArea.textContent = result;

    document.getElementById("copy").disabled = false;
  }
}

const uploadFile = document.getElementById("user-file");
const convertButton = document.getElementById("convert");
const copyButton = document.getElementById("copy");
const converter = new Converter();

uploadFile.addEventListener("change", () => {
  converter.uploadSave();
});

convertButton.addEventListener("click", () => {
  converter.convert();
});

copyButton.addEventListener("click", () => {
  //https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
  let copyText = document.getElementById("result");
  navigator.clipboard.writeText(copyText.textContent);
  copyButton.textContent = "Copied!";
});
