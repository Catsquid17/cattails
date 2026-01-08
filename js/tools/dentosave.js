//hastily restructured savetoden -- not done cause i dont feel like it rn

class Converter {
  constructor() {
    this.save = null;
    this.region = null;
    this.grid = null;
    this.furniture = null;
    this.styles = null;
  }
  tryButton() {
    const button = document.getElementById("convert");
    button.disabled = true;
    if (this.save && this.region) {
      button.disabled = false;
    }
  }
  uploadFile(isSave) {
    const fileMsg = isSave ? document.getElementById("file-message") : document.getElementById("region-file-message");

    const uploadFile = isSave ? document.getElementById("user-file") : document.getElementById("user-region-file");
    fileMsg.innerHTML = "";

    var file = uploadFile.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (event) => {
      const contents = event.target.result;
      try {
        //parse to JSON. make sure it stops sending chars after last } because there may be an invisible char at the end of these files
        if (isSave) {
          this.save = JSON.parse(`${contents.slice(0, contents.lastIndexOf("}")).trim()}}`);
          fileMsg.innerHTML = `File read successfully. This is ${this.save.player_name}'s file.`;
        } else {
          this.region = JSON.parse(`${contents.slice(0, contents.lastIndexOf("}")).trim()}}`);
          fileMsg.innerHTML = `File read successfully.`;
        }
      } catch (error) {
        //likely the wrong kind of file
        if (isSave) {
          this.save = null;
        } else {
          this.region = null;
          fileMsg.innerHTML = `File read successfully.`;
        }
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
    if (this.save && this.region) {
      this.flipGrid();
      this.reformatFurniture();
      this.determineStyles();
      this.convertGrid();
      this.save.player_den_grid = this.grid;
      this.showResult();
    }
  }
  flipGrid() {
    let newGrid = [];
    let newRow = [];
    const oldGrid = this.region.npc_den_grid;
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

    //bottom row can't be edited, always has 3 tiles that are not stored in save file - idk if this matters for this version
    let lastRow = this.grid.length - 1;
    this.grid[lastRow][14] = 1;
    this.grid[lastRow][15] = 1;
    this.grid[lastRow][16] = 1;
  }

  reformatFurniture() {
    let list = this.region.npc_den_furniture; //this.save.furniture_layout_list;

    let i = 0;
    for (let item of list) {
      for (let field of Object.keys(list[i])) {
        if (field == "direction") {
          switch (list[i][field]) {
            case "north":
              list[i][field] = 0;
              break;
            case "east":
              list[i][field] = 1;
              break;
            case "south":
              list[i][field] = 2;
              break;
            case "west":
              list[i][field] = 3;
              break;
          }
        }
      }
      i++;
    }

    this.save.furniture_layout_list = list;
  }

  determineStyles() {
    //set style 1 to whatever the npc den was using
    this.save.den_styles[0] = [this.region.npc_den_floor_style + 1, this.region.npc_den_wall_style + 1];
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

    result = JSON.stringify(this.save);
    resultArea.textContent = result;

    document.getElementById("copy").disabled = false;
  }
}

const uploadFile = document.getElementById("user-file");
const uploadRegionFile = document.getElementById("user-region-file");
const convertButton = document.getElementById("convert");
const copyButton = document.getElementById("copy");
const converter = new Converter();

uploadFile.addEventListener("change", () => {
  converter.uploadFile(true);
  converter.tryButton();
});
uploadRegionFile.addEventListener("change", () => {
  converter.uploadFile(false);
  converter.tryButton();
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
