"use strict";

let globalSettings = {"den": "Default", "create": "Conditionally", "parent": "Bio"};
let currentPage = "home"; //home -> upload -> questions -> download; home -> settings; home -> instructions;
let contentArea = document.querySelector("#content");
let save = '{"key": "value"}';

window.onload = function() {
  homePage();
};
//================================================================================================================================================================================================
const homePage = () => {
  currentPage = "home";
  contentArea.innerHTML = "";
  contentArea.setAttribute("id", "home");

  let image = document.createElement('img');
  let paragraph = document.createElement('p');
  let start = createButton("next");
  let settings = createButton("Settings");
  let instructions = createButton("Instructions");

  paragraph.innerHTML = "This is a blurb explaining all about my super cool super awesome super secret project! Oh boy I sure do hope I finish it someday. Maybe late 2026 if I'm lucky";
  image.setAttribute("src", "https://placehold.co/400");
  image.setAttribute("alt", "Sample Image");
  image.setAttribute("title", "Sample Image");
  image.setAttribute("width", "400");
  image.setAttribute("height", "400");
  image.setAttribute("id", "home-img");
  start.innerHTML = "Start";
  start.classList.remove("next");
  settings.addEventListener("click", () => settingsPage());
  instructions.addEventListener("click", () => instructionsPage());

  let menu = document.createElement('ul');
  menu.setAttribute("id", "button-list");
  let buttons = [start, settings, instructions];
  for (let button of buttons) {
    let item = document.createElement('li');
    item.appendChild(button);
    menu.append(item);
  }
  
  contentArea.appendChild(image);
  contentArea.appendChild(paragraph);
  contentArea.appendChild(menu);
}
//================================================================================================================================================================================================
const settingsPage = () => {
  currentPage = "settings";
  contentArea.innerHTML = "";
  contentArea.setAttribute("id", "settings");

  let heading = document.createElement('h2');
  let paragraph = document.createElement('p');
  heading.innerHTML = "Settings";
  paragraph.innerHTML = "These settings do not save between instances of the program, so be careful! Could I save them? Yeah probably. But you're not supposed to use this every day and there are a whole Three settings. So I'm not going to";
  contentArea.appendChild(heading);
  contentArea.appendChild(paragraph);
  
  let settings = [["Default", "Indoor", "Outdoor"], ["Conditionally", "Always", "Never"], ["Bio", "Step"]];
  let settingTexts = ["Den?", "Create?", "Parent?"];
  let numSettings = 0;
  let br = document.createElement('br');
  let input = document.createElement('input');

  for (let setting of settings) {
    numSettings++;
    let settingText = document.createElement('p');
    let strong = document.createElement('strong');
    strong.innerHTML = settingTexts[numSettings-1]
    settingText.appendChild(strong);
    contentArea.appendChild(settingText);
    
    input.setAttribute("type", "radio");
    input.setAttribute("name", `setting-${numSettings}`);

    let numOptions = 0;
    for (let option of setting) {
      let opt = input.cloneNode(true);
      let lineBreak = br.cloneNode()
      opt.setAttribute("id", option.toLowerCase());
      opt.setAttribute("value", option);
      if (globalSettings.den == null && numOptions == 0) {
        opt.checked = true; //first option should be selected by default
      }
      else if ((numSettings == 1 && option == globalSettings.den) || (numSettings == 2 && option == globalSettings.create) || (numSettings == 3 && option == globalSettings.parent)) {
        //if we're looking at setting1 and setting1 = the name of this option, make it checked
        opt.checked = true;
      }
      
      let label = document.createElement('label');
      label.setAttribute("for", option.toLowerCase());
      label.innerHTML = option;

      contentArea.appendChild(opt);
      contentArea.appendChild(label);
      contentArea.appendChild(lineBreak);
      numOptions++;
    }
  }
  
  let back = createButton("back");
  contentArea.appendChild(back);
}
//================================================================================================================================================================================================
const instructionsPage = () => {
  currentPage = "instructions";
  contentArea.innerHTML = "";
  contentArea.setAttribute("id", "instructions");

  let heading = document.createElement('h2');
  let paragraph = document.createElement('p');
  let video = `<iframe width="1500" height="576" src="https://www.youtube.com/embed/8FQ2eGjcjBo" title="Cattails: Wildwood Story — Launch Trailer (Steam)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  heading.innerHTML = "Instructions";
  paragraph.innerHTML = `Here's how to use this page! It does something really cool! But you don't get to know yet, so I changed all the text to meows. But there might even be a video! I wonder if I can just paste the embed code here ${video}`;
  contentArea.appendChild(heading);
  contentArea.appendChild(paragraph);
  
  let list = document.createElement('ol');
  //i could just define these in the array but that would make editing and reading this excruciating for no reason
  let steps = [];
  steps.push("<strong>Weew e mwe Mwe Eeww mwow wm Eeooewoe Ewooeeeo Eoemw.</strong> Wew eem oe oowe oomeweo oow oemoeo em oow owmo ewow em oow Owwoow emew wewm ewoowm mweeowe owmwo 10. Emew wew oemw emweowo oow eemw mwow, eemw wewm eeww emo eoeew Eeooewoe.<ul><li>Mw eemwmwo! Wm wew oemw meo eewoowowo e mwmeo wemmweew, oowwm ewoowme ewoo meo eoowem wm wewm me mwow. Oowmw emw mwmw mwmeo wemmweewe oeoeo.</li><li>Mewwe, eoowememewe, emo eeeweeemwwe em oow ooewwm emo oowwm ewoowme ewoo eoo mw eemmwwo emwm oe oow weo. Ooweew weew ewmw wmwmwoowme we woeeoow oee wew eemo wo mwmemw eemowmwwme.</li></ul>");
  steps.push("<strong>Oeeeow wewm eemw mwowe.</strong> Wew ewoo mwwo oe wooeeo oow OEMWMO'e mwow, MEO oow me mwow wew mweo emweowo. Oow mwowe emw wm <code>E:\\Wewme\\MEWW\\EooOeoe\\Oeeeo\\Eeooewoe_Ewooeeeo_Eoemw\\eemwe</code>, eowmw MEWW we oow meww em wewm OE.<mm>Oow EooOeoe meoowm we owoowm mw owmewoo. Meooee oowew wmeomweoweme wm wew emw oemwme omewmow:<ol><li>Omwee Ewm+M. Ewm we eoemo mem oow Ewmoeee eww.</li><li>Owow wm %EOOOEOE% emo omwee EE. E meoowm ewoo oeo wo.</li><li>Oeee eo oow oeo em wewm mwow woooemwm emo weew ewmw wew emw wm EooOeoe, meo Meewwme.</li><li>Eowee oomeweo oow meoowme Oeeeo, Eeooewoe_Ewooeeeo_Eoemw, emo eemwe.</li><li>Eowee em oow mem eo oow oeo em wewm mwow woooemwm emo eeow oow meoowm oeoo.</li><li>Eoemw oow oeoo wm Meowoeo em eowmwmwm wew eem ewwo omeee em wo.</li><li>Eoo oow mwow meww em wewm eemw mwow oe oow wmo em wewm oeoo. Oow mwwmwme wm oow mwow mewwe eemmweoemo ewoo oow ewmmwmo eemw eoeo. Ee, wm oow oemwmo'e mwow we wm eemw eoeo 10, eoo \"\\eoeo10.eem\" oe oow wmo.</li><li>Oow mwmeo oeoo eoewoo oeee owew <code>E:\\Wewme\\MEWW\\EooOeoe\\Oeeeo\\Eeooewoe_Ewooeeeo_Eoemw\\eemwe\\eoeo10.eem</code></li></ol>");
  steps.push("Mwowmm oe oow ewoeeww oeew emo <strong>ewoweo \"Ewoowmee\" oe mwmwwe oow weo weewm'e eooweme.</strong> Oow mmeeewm ewoo meo mwwwwmwm wewm eoewewe wm wew mwoeeo, ee mw eemwmwo!");
  steps.push("Mmew oow ewoeeww oeew, <strong>ewoweo \"Eoemo\".</strong>");
  steps.push("<strong>Wooeeo oow oemwmo'e eemw mwow.</strong> Mwmeo, eowee oow wooeeo mwooem. Wm wew oemw oow mwow oeoo emwoowm oeem mmew eowo 2, wew eem eeow wo emo oeeow wo wmoe oow mem eo oow oeo em oow \"Ewoweo e mwow\" ewmoee. Eoowmewew, wew eem wemweoow mmeeew wewm eewowowm emo oeeeow wewm mwow");
  steps.push("<strong>Wooeeo oow oemwmo'e eeeo eeoem.</strong> Eeeo eeoeme emw eoemwo mwmw eoeewow oe eemw mwowe, ee eoo wew oemw oe oe we meee ewo em oow \"eemwe\" meoowm, wmowm oow \"eeoeme\" meoowm, emo ewoweo oow mweoo eeeo. Oowe eowo wew mw eoowemeo owowmowme em wewm ewoowmee.");
  steps.push("Omemwow eeww wmmemweowem emewo wewm mwow em oow mwoo oeew. Wew'oo mwwo oe wowmowmw eoweo ewoowm wew weow wewm me mwow ewoo. Wew eem eoee eowewmw emw eeoe ooeo wew mw mwoeowo oe wewm me eoemeeowm. Weeo mwoeowmwe ewoo mw mwoowo ewo ewoeweoweeoow, mwo oowe we wewmwo wm wew oemw oweoeememe em wwoowoow ewmwmeoweme.");
  steps.push("Omeewwo oe oow mwoo oeew emo wewm weo ewoo mwmweo omeeweewme. Oeemoeeo oow mwow emo wmeoeoo wo ee wew eewoo emw eoowm weo.");
  steps.push("Oewmeo oow eeww. Wm me wmmem wweeeew oeoe wo, oow weo oee mwwm wmeoeoowo eweeweemwoow! Mwo mwwwwmwm: oowe weo ewoo emow mw eewoeowmow ewoo oow mwow wew ewmwmeowo wo mem. Wm wew eewoo owew oe ooew ewoo EMW eoowm mwow, me em eoowmewew, ooweew oeew oowe weo ewo em wewm weoe meoowm mwmeo.");
  for (let step of steps) {
    let item = document.createElement('li');
    item.innerHTML = step;
    list.appendChild(item);
  }
  contentArea.appendChild(list);
  
  let back = createButton("back");
  contentArea.appendChild(back);
}
//================================================================================================================================================================================================
const uploadPage = () => {
  currentPage = "upload";
  contentArea.innerHTML = "";
  contentArea.setAttribute("id", "upload");

  let heading = document.createElement('h2');
  let paragraph = document.createElement('p');
  let uploadFile = document.createElement('input');
  let uploadColor = document.createElement('input');
  heading.innerHTML = "Upload";
  paragraph.innerHTML = "Please upload something or other";
  uploadFile.setAttribute("id", "user-file");
  uploadFile.setAttribute("type", "file");
  uploadFile.setAttribute("accept", ".sav");
  uploadColor.setAttribute("id", "user-color");
  uploadColor.setAttribute("type", "file");
  uploadColor.setAttribute("accept", "image/png");
  contentArea.appendChild(heading);
  contentArea.appendChild(paragraph);
  contentArea.appendChild(uploadFile);
  contentArea.appendChild(uploadColor);
  let validFile = false;
  let validColor = false;

  //i dont actually need to store these files on a server so i can skip a lot of what they do here
  //https://stackoverflow.com/questions/16505333/get-the-data-of-uploaded-file-in-javascript
  //https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers 
  uploadFile.addEventListener("change", () => {
    var file = uploadFile.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (event) {
      const contents = event.target.result;
      save = JSON.parse(`${contents.slice(0, contents.lastIndexOf("}")).trim()}}`); //parse to JSON. make sure it stops sending chars after last } because there may be an invisible char at the end of these files
      console.log(`The player is named ${save.player_name}`);
      if (save.has_kittens == "1.0" || save.has_kittens == "1" || save.has_kittens == "true") {
        console.log("valid file!")
        validFile = true;
      }
      else {
        console.log("the file was successfully read but is not valid.")
        validFile = false;
      }
    }
    reader.onerror = function (event) {
      console.log("Error");
      validFile = false;
    }

    if (validFile == true && validColor == true) {
      next.disabled = false; //enable button when files are valid
    }
  });
  uploadColor.addEventListener("change", () => {
    console.log("color");

    //not going to bother with this just yet, but this may be useful later:
    //https://stackoverflow.com/questions/61514128/javascript-get-pixel-data-of-image
    validColor = true;
    if (validFile == true && validColor == true) {
      next.disabled = false; //enable button when files are valid
    }
  });
  
  let back = createButton("back");
  let next = createButton("next");
  next.disabled = true; //disable button until files provided
  contentArea.appendChild(back);
  contentArea.appendChild(next);
}
//================================================================================================================================================================================================
const questionsPage = () => {
  currentPage = "questions";
  contentArea.innerHTML = "";
  contentArea.setAttribute("id", "questions");

  let heading = document.createElement('h2');
  let paragraph = document.createElement('p');
  heading.innerHTML = "Questions";
  paragraph.innerHTML = "I have questions for you";
  contentArea.appendChild(heading);
  contentArea.appendChild(paragraph);
  
  let back = createButton("back");
  let next = createButton("next");
  contentArea.appendChild(back);
  contentArea.appendChild(next);
}
//================================================================================================================================================================================================
const downloadPage = () => {
  currentPage = "download";
  contentArea.innerHTML = "";
  contentArea.setAttribute("id", "download");

  let heading = document.createElement('h2');
  let paragraph = document.createElement('p');
  heading.innerHTML = "Download";
  paragraph.innerHTML = "You can download this if you want";
  contentArea.appendChild(heading);
  contentArea.appendChild(paragraph);

  let dlBtn = createButton("Download");
  dlBtn.addEventListener("click", () => zipEverything());
  contentArea.appendChild(dlBtn);
  
  let back = createButton("back");
  let next = createButton("next");
  contentArea.appendChild(back);
  contentArea.appendChild(next);
}
//================================================================================================================================================================================================
const zipEverything = () => {
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
//================================================================================================================================================================================================
const createButton = (direction) => {
  let button = document.createElement('button');
  button.setAttribute("type", "button");
  button.classList.add("btn");
  button.classList.add("btn-primary");
  if (direction == "next") {
    button.classList.add("next");
    button.innerHTML = "Next >";
    button.addEventListener("click", () => pageChange("next"));
  }
  else if (direction == "back") {
    button.classList.add("back");
    button.innerHTML = "< Back";
    button.addEventListener("click", () => pageChange("back"));
  }
  else {
    button.innerHTML = direction;
  }
  return button;
}
//================================================================================================================================================================================================
const pageChange = (direction) => {
  //home -> upload -> questions -> download; home -> settings; home -> instructions;
  if (direction == "next") {
    switch (currentPage) {
      case "home":
        uploadPage();
        break;
      case "upload":
        questionsPage();
        break;
      case "questions":
        downloadPage();
        break;
      default:
        homePage();
    }
  }
  //questions & dl will probably end up either having restart buttons or no buttons but for now ill keep them like this
  else if (direction == "back") {
    switch (currentPage) {
      case "settings":
        updateData();
        homePage();
        break;
      case "questions":
        uploadPage();
        break;
      case "download":
        questionsPage();
        break;
      default:
        homePage();
    }
  }
}
//================================================================================================================================================================================================
const updateData = () => {
  if (currentPage == "settings") {
    //https://stackoverflow.com/questions/44961780/store-data-from-html-radio-buttons-into-javascript-array
    globalSettings.den = document.querySelector('[name="setting-1"]:checked').value; //will select whatever option is selected in the set of options named "setting-1"
    globalSettings.create = document.querySelector('[name="setting-2"]:checked').value;
    globalSettings.parent = document.querySelector('[name="setting-3"]:checked').value;
    }
}

//element.innerHTML = "blah";
//element.classList.add()
//element.setAttribute("href", "hi.com")
//parent = element.parentNode
