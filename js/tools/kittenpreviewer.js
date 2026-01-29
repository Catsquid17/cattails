// classes =================================================================
class ImageGrid {
  constructor() {
    this.canvasElement = document.querySelector("#result");
    this.canvas;
    this.imageObjects = [];
  }
  async initialize() {
    this.canvasElement.width = (128 + 5) * 4;
    this.canvasElement.height = (108 + 2) * 3;
    this.canvas = new fabric.StaticCanvas(this.canvasElement);
    this.canvas.width = this.canvasElement.width;
    this.canvas.height = this.canvas.height;

    for (let i = 0; i < 12; i++) {
      this.imageObjects.push(new SingleImage(i));
    }
    await this.update();
  }
  async update() {
    let one = [...getPeltData(document.querySelector("#one").value)];
    let two = [...getPeltData(document.querySelector("#two").value)];
    one.push([...getEyeData(document.querySelector("#one-eyes").value)]);
    two.push([...getEyeData(document.querySelector("#two-eyes").value)]);
    for (let image of this.imageObjects) {
      //send a copy of one/two, otherwise their values will be modified and later images will be thrown off
      image.update([...one], [...two]);
    }
    await this.draw();
  }
  async draw() {
    this.canvas.clear();
    for (let image of this.imageObjects) {
      await image.draw(this.canvas);
    }
    this.canvas.renderAll();
  }
}

class SingleImage {
  constructor(id) {
    this.id = id; //determines what style/option this image is
    this.xGap = (id % 4) * 5;
    this.yGap = Math.floor(id / 4) * 2;
    this.x = (id % 4) * 128 + this.xGap; //positioning
    this.y = Math.floor(id / 4) * 108 + this.yGap;
    this.one;
    this.two;
    this.colors = [];
    this.orderedColors = [];
  }
  update(one, two) {
    this.one = one;
    this.two = two;
    switch (this.id) {
      case 0:
        this.colors = this.one;
        break;
      case 1:
        this.colors = this.two;
        break;
      case 2:
        this.colors = this.one;
        this.setColorAtIndexes([4, 5, 6, 7, 8, 10, 11, 12, 13, 9, 14, 15, 3, 6, 16], "mix");
        break;
      case 3:
        this.colors = this.one;
        this.setColorAtIndexes([0, 4, 5, 7, 8, 2, 10, 11, 12, 13, 9, 14, 15, 3, 1, 6, 16, 17], "mix");
        break;
      case 4:
        this.colors = this.one;
        this.setColorAtIndexes([4, 5, 7, 10, 11, 9], this.two);
        break;
      case 5:
        this.colors = this.two;
        this.setColorAtIndexes([7, 2, 10, 11, 9], this.one);
        break;
      case 6:
        this.colors = this.one;
        this.setColorAtIndexes([4, 5, 7, 8, 2, 3, 1, 6], this.two);
        this.setColorAtIndexes([0, 17], "mix");
        break;
      case 7:
        this.colors = this.two;
        this.setColorAtIndexes([0, 2, 9, 1, 6, 16, 17], this.one);
        break;
      case 8:
        this.colors = this.one;
        this.setColorAtIndexes([7, 2, 10, 11, 9], this.two);
        break;
      case 9:
        this.colors = this.two;
        this.setColorAtIndexes([4, 5, 7, 10, 11, 9], this.one);
        break;
      case 10:
        this.colors = this.two;
        this.setColorAtIndexes([4, 5, 7, 8, 2, 3, 1, 6], this.one);
        this.setColorAtIndexes([0, 17], "mix");
        break;
      case 11:
        this.colors = this.one;
        this.setColorAtIndexes([0, 2, 9, 1, 6, 16, 17], this.two);
        break;
      default:
        this.colors = this.one;
        break;
    }
    if (this.id != 0 && this.id != 1) {
      let eyeSource;
      switch (Math.floor(Math.random() * 3)) {
        case 0:
          eyeSource = this.one;
          break;
        case 1:
          eyeSource = this.two;
          break;
        case 2:
          eyeSource = "mix";
      }
      this.setColorAtIndexes([18], eyeSource);
    }
  }
  mix(one, two) {
    //where one and two are both rgbs
    let newColor = [];
    for (let i in one) {
      let avg = Math.ceil((one[i] + two[i]) / 2);
      newColor.push(Math.min(Math.max(avg, 0), 255));
    }
    return newColor;
  }
  setColorAtIndexes(indexes, src) {
    if (src == "mix") {
      for (let i of indexes) {
        this.colors[i] = this.mix([...this.one[i]], [...this.two[i]]);
      }
    } else {
      for (let i of indexes) {
        this.colors[i] = [...src[i]];
      }
    }
  }
  async draw(canvas) {
    let colors = [...this.colors]; //make sure the original is not modified
    colors.push([255, 255, 255]); //for inner ear
    let mustDraw = ["base", "inner_ear"];

    for (let i in partNames) {
      let name = partNames[i];
      let file = files[`${name}.png`];
      let c = colors[i];

      if (mustDraw.includes(name) || c.toString() != this.colors[0].toString()) {
        let blob = new Blob([file], { type: "image/png" });
        let url = URL.createObjectURL(blob);
        let img = await new Promise((resolve) => {
          let element = new Image();
          element.onload = () => resolve(new fabric.Image(element, { left: this.x, top: this.y, originX: "left", originY: "top" }));
          element.src = url;
        });
        //recolor
        let r = c[0],
          g = c[1],
          b = c[2];
        if (r != 255 || g != 255 || b != 255) {
          img.filters.push(new fabric.Image.filters.BlendColor({ color: `rgb(${r},${g},${b})`, mode: "multiply" }));
          img.applyFilters();
        }

        canvas.add(img);
        URL.revokeObjectURL(url);
      }
    }
  }
}

// main program ========================================================
//in order, bottom to top
const partNames = ["base", "face", "muzzle", "face_stripes", "left_ear", "right_ear", "tail", "tail_tip", "tail_stripe", "belly", "paws_one", "paws_two", "leg_stripe_one", "leg_stripe_two", "stripes_one", "stripes_two", "spots", "rosettes", "eye", "inner_ear"];

let grid = new ImageGrid();
let one = document.querySelector("#one");
let two = document.querySelector("#two");
let oneEyes = document.querySelector("#one-eyes");
let twoEyes = document.querySelector("#two-eyes");
let files;
one.addEventListener("change", () => {
  grid.update();
});
two.addEventListener("change", () => {
  grid.update();
});
oneEyes.addEventListener("change", () => {
  grid.update();
});
twoEyes.addEventListener("change", () => {
  grid.update();
});

window.onload = async function () {
  files = await loadFiles();
  colorDropdowns();
  await grid.initialize();
};

const loadFiles = async () => {
  //PRODUCTION:
  let prefix = "cattails";
  //FOR LOCAL TESTING:
  //let prefix = "../../";
  let paths = ["pelt_data.json", "eye_data.json", "inner_ear.png"];
  for (let part of partNames) {
    paths.push(`${part}.png`);
  }

  let files = [];
  for (let path of paths) {
    //fetch item at specified path, store the response
    let fileContent = null;
    if (path.endsWith(".png")) {
      const res = await fetch(`${prefix}images/tools/kittenpreviewer/${path}`);
      fileContent = new Uint8Array(await res.arrayBuffer()); //i dont need to use fflate this time so idk if this is necessary, but i definitely cant store it as json so
    } else {
      const res = await fetch(`${prefix}data/tools/${path}`);
      fileContent = await res.json();
    }
    files[path] = fileContent;
  }

  return files;
};

//looks at user selection & returns data from the JSON
const getPeltData = (selection) => {
  //the base keyword is useful for integrity but hinders color mixing, replace it with what it represents on load
  let data = files["pelt_data.json"][selection];
  for (let i in data) {
    if (data[i] == "base") {
      data[i] = data[0];
    }
  }
  return data;
};
const getEyeData = (selection) => {
  return files["eye_data.json"][selection];
};

const colorDropdowns = () => {
  let count = 0;
  for (let dropdown of [one, two, oneEyes, twoEyes]) {
    for (let opt of dropdown.options) {
      let data;
      if (count < 2) {
        data = [...getPeltData(opt.value)][0];
      } else {
        data = getEyeData(opt.value);
      }
      let color = `rgb(${data.toString()})`;
      let sum = data[0] + data[1] + data[2];
      opt.style.backgroundColor = color;
      if (sum < 390) {
        opt.style.color = "white";
      }
      if (Math.max(...data) > 230) {
        opt.style.color = "";
      }
    }
    count++;
  }
};
