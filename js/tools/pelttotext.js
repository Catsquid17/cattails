class Converter {
  constructor() {
    this.colors = null;
  }
  async upload() {
    let tempColors = []; //await messes with "this"
    const colorURL = URL.createObjectURL(uploadColor.files[0]);
    for (let i = 0; i < 23; i++) {
      let thisColor = await this.getPixel(colorURL, i, 0);
      tempColors.push(thisColor.slice(0, 3)); //remove A channel, dont need it
    }
    let rightEye = await this.getPixel(colorURL, 50, 108);
    let leftEye = await this.getPixel(colorURL, 65, 108);
    tempColors.push(rightEye.slice(0, 3)); //eye colors are stored in save file, but accessories dont render in coat files, so this pixel SHOULD hold the right value if the coat was saved with the right color
    tempColors.push(leftEye.slice(0, 3));
    this.colors = tempColors;

    const convertButton = document.getElementById("convert");
    convertButton.disabled = false; //enable button - should only happen if input was valid but thats for later
  }
  convert() {
    let c = this.colors;
    let result = `\t"torso": [${c[0]}], "feet": [${c[1]}], "paw_front_one": [${c[2]}], "paw_front_two": [${c[3]}], "paw_back_one": [${c[4]}], "paw_back_two": [${c[5]}], "face": [${c[6]}], "stripes": [${c[7]}], "stripes_two": [${c[21]}], "face_stripes": [${c[9]}], "belly": [${c[8]}], "muzzle": [${c[10]}], "eyes_left": [${c[24]}], "eyes_right": [${c[23]}], "ear_outer_left": [${c[11]}], "ear_outer_right": [${c[12]}], "ears_inner": [${c[13]}], "tail": [${c[14]}], "tail_tip": [${c[15]}], "patches_one": [${c[16]}], "patches_two": [${c[17]}], "rosettes": [${c[18]}], "nose": [${c[19]}], "point": [${c[20]}], "speckles": [${c[22]}],`;

    result = result.replaceAll(",", ", ").replaceAll(',  "', ',\n\t"npc_colors_').replaceAll("torso", "npc_colors_torso");

    const resultArea = document.getElementById("result");
    resultArea.textContent = result;
    document.getElementById("copy").disabled = false;
  }
  async getPixel(url, x, y) {
    //https://www.reddit.com/r/learnjavascript/comments/1eudk3l/how_to_get_rgb_data_of_a_image/
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const image = new Image();
    image.src = url;
    await image.decode();

    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0);
    const imageBuffer = context.getImageData(x, y, 1, 1);

    return imageBuffer.data;
  }
}

const uploadColor = document.getElementById("user-color");
const convertButton = document.getElementById("convert");
const copyButton = document.getElementById("copy");
const converter = new Converter();

uploadColor.addEventListener("change", async () => {
  converter.upload();
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
