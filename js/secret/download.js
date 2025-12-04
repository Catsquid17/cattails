import { PageBuilder } from "./pagebuilder.js";

PageBuilder.prototype.downloadPage = function () {
  this.currentPage = "download";
  this.contentArea.innerHTML = "";
  this.contentArea.setAttribute("id", "download");

  let heading = document.createElement('h2');
  let paragraph = document.createElement('p');
  heading.innerHTML = "Download";
  paragraph.innerHTML = "You can download this if you want";
  this.contentArea.appendChild(heading);
  this.contentArea.appendChild(paragraph);

  let dlBtn = this.createButton("Download");
  dlBtn.addEventListener("click", () => zipEverything(this.save, this.contentArea));
  this.contentArea.appendChild(dlBtn);
  
  let next = this.createButton("next");
  next.innerHTML = "Done";
  next.addEventListener("click", () => this.reset());
  this.contentArea.appendChild(next);
}

const zipEverything = (save, contentArea) => {
  //https://github.com/101arrowz/fflate
  //define each file's name and contents - placeholders for now
  const files = {
    "Test/1/1.txt": save.player_name,
    "Test/2/2.txt": `${save.kitten_one_name}, ${save.kitten_two_name}, ${save.kitten_three_name}, ${save.kitten_four_name}`
  };
  
  const filesToZip = {}; //holds result of below
  //turns the pair of name/content strings into a data type the zipper can work with
  for (const [fileName, fileContents] of Object.entries(files)) {
    filesToZip[fileName] = fflate.strToU8(fileContents);
  }
  
  const zippedFiles = fflate.zipSync(filesToZip); //zips files
  
  //https://flexiple.com/javascript/download-flle-using-javascript
  const dlURL = new Blob([zippedFiles], { type: "application/zip" }); //i dont really get what a blob is but everyone uses it all the time
  const dl = document.createElement("a"); //create a download button (it has to be an <a>)
  dl.href = URL.createObjectURL(dlURL); //put the blob in as the URL
  dl.download = "test-download.zip"; //name of file to be downloaded
  dl.classList.add("download"); //style button
  contentArea.appendChild(dl);
  dl.click();
  URL.revokeObjectURL(dl.href); //clear memory URL was stored in
}