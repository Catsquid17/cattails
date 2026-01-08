import { PageBuilder } from "./pagebuilder.js";

PageBuilder.prototype.uploadPage = function () {
  this.currentPage = "upload";
  this.contentArea.innerHTML = "";
  this.contentArea.setAttribute("id", "upload");

  let heading = document.createElement('h2');
  let paragraph = document.createElement('p');
  let uploadFile = document.createElement('input');
  let uploadColor = document.createElement('input');
  let fileMsg = document.createElement('strong');
  let colorMsg = document.createElement('strong');
  heading.innerHTML = "Upload";
  paragraph.innerHTML = "Please upload something or other";
  uploadFile.setAttribute("id", "user-file");
  uploadFile.setAttribute("type", "file");
  uploadFile.setAttribute("accept", ".sav");
  uploadColor.setAttribute("id", "user-color");
  uploadColor.setAttribute("type", "file");
  uploadColor.setAttribute("accept", "image/png");
  uploadColor.classList.add("visually-hidden");
  this.contentArea.appendChild(heading);
  this.contentArea.appendChild(paragraph);
  this.contentArea.appendChild(uploadFile);
  this.contentArea.appendChild(fileMsg);
  this.contentArea.appendChild(uploadColor);
  this.contentArea.appendChild(colorMsg);

  //i dont actually need to store these files on a server so i can skip a lot of what they do here
  //https://stackoverflow.com/questions/16505333/get-the-data-of-uploaded-file-in-javascript
  //https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers 
  uploadFile.addEventListener("change", () => {
    next.disabled = true; //disable button. if file using default is uploaded, then a normal one, next will stil be enabled even though color is needed. dont love having this long-term but this encourages user to check if color is right so maybe its better
    uploadColor.classList.add("visually-hidden"); //same logic as above
    var file = uploadFile.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (event) => {
      const contents = event.target.result;
      try {
        this.save = JSON.parse(`${contents.slice(0, contents.lastIndexOf("}")).trim()}}`); //parse to JSON. make sure it stops sending chars after last } because there may be an invisible char at the end of these files
        if (this.save.has_kittens == "1.0" || this.save.has_kittens == "1" || this.save.has_kittens == "true") {
          fileMsg.innerHTML = `File read successfully. This is ${this.save.player_name}'s file.`

          //determine whether showing color upload is needed
          if (this.globalSettings.create == "Yes") {
            let defaultColors = [];
            fetch("../secret/default_colors.json")
              .then(response => response.json())
              .then(json => {
                defaultColors = json.default_colors
                //if player is using a default color, they will not have a color file to upload
                if (defaultColors.includes(this.save.player_color_guid)) {
                  //later: will need to store the actual values for each default coat and load them here, not particuarly important for now
                  //consider adding message "Color detected automatically"
                  console.log("default used");
                  next.disabled = false; //enable button, no color file needed
                } else {
                  uploadColor.classList.remove("visually-hidden");
                }
            });
          }
          else {
            //uploading color is not needed if setting is disabled
            next.disabled = false; //enable button
          }
        }
        else {
          fileMsg.innerHTML = "The file was successfully read but is not valid."
        }
      } catch (error) {
        //if file cannot be parsed, it is likely the wrong kind of file, be sure to reject it
        fileMsg.innerHTML = "Error reading file!"
      }
    }
    reader.onerror = function (event) {
      fileMsg.innerHTML = "Error reading file!"
    }
  });
  uploadColor.addEventListener("change", async () => {
    let tempColors = [];
    const colorURL = URL.createObjectURL(uploadColor.files[0]);
    //after parsing this.save, determining color file is needed, and that it is not default:
    for (let i = 0; i < 23; i++) {
      let thisColor = await getPixel(colorURL, i, 0);
      tempColors.push(thisColor.slice(0,3)); //remove A channel, dont need it
    }
    this.colors = tempColors;
    next.disabled = false; //enable button - should only happen if input was valid but thats for later
  });
  
  let back = this.createButton("back");
  let next = this.createButton("next");
  next.disabled = true; //disable button until files provided
  this.contentArea.appendChild(back);
  this.contentArea.appendChild(next);
}

//https://www.reddit.com/r/learnjavascript/comments/1eudk3l/how_to_get_rgb_data_of_a_image/
const getPixel = async (url, x, y) => {
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