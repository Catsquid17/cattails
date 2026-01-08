import { PageBuilder } from "./pagebuilder.js";
import { Mod } from "../export.js";

PageBuilder.prototype.downloadPage = function () {
  this.currentPage = "download";
  this.contentArea.innerHTML = "";
  this.contentArea.setAttribute("id", "download");

  let heading = document.createElement("h2");
  let paragraph = document.createElement("p");
  heading.innerHTML = "Download";
  paragraph.innerHTML = "You can download this if you want";
  this.contentArea.appendChild(heading);
  this.contentArea.appendChild(paragraph);

  let dlBtn = this.createButton("Download");
  dlBtn.addEventListener("click", () => {
    let mod = new Mod(this.save, this.dataFiles);
    mod.buildMod(this.heir, this.objectsToBuild);
    zipEverything(mod.files, mod.name, this.contentArea);
  });
  this.contentArea.appendChild(dlBtn);

  let next = this.createButton("next");
  next.innerHTML = "Done";
  next.addEventListener("click", () => this.reset());
  this.contentArea.appendChild(next);
};

const zipEverything = (files, modName, contentArea) => {
  const filesToZip = {}; //holds result of below
  //turns the pair of name/content strings into a data type the zipper can work with
  for (const [fileName, fileContents] of Object.entries(files)) {
    if (fileContents instanceof Uint8Array) {
      filesToZip[fileName] = fileContents; //if it's an image, it's already a U8 array & running strToU8 will break it
    } else {
      filesToZip[fileName] = fflate.strToU8(fileContents); //convert everything else to U8 array so it can be zipped
    }
  }

  const zippedFiles = fflate.zipSync(filesToZip); //zips files
  const d = new Date();
  let dateString = `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`; //to use in file name

  //https://flexiple.com/javascript/download-flle-using-javascript
  const dlURL = new Blob([zippedFiles], { type: "application/zip" }); //i dont really get what a blob is but everyone uses it all the time
  const dl = document.createElement("a"); //create a download button (it has to be an <a>)
  dl.href = URL.createObjectURL(dlURL); //put the blob in as the URL
  dl.download = `${modName} ${dateString}.zip`; //name of file to be downloaded
  dl.classList.add("download"); //style button
  contentArea.appendChild(dl);
  dl.click();
  URL.revokeObjectURL(dl.href); //clear memory URL was stored in
};
