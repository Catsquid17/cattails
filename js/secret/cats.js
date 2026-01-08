export { Player, Sibling, FormerRivalKitten, NewRivalKitten };

class Cat {
  constructor() {
    this.name = null;
    this.meta = null;
    this.lang = null;
  }
  oleToRGB(ole) {
    //http://www.pneity.org/rgb-ole.html
    let r = Math.floor(ole % 256);
    let g = Math.floor((ole / 256) % 256);
    let b = Math.floor((ole / 65536) % 256);
    return [r, g, b];
  }
  getJSONFile(dataFiles, folders, name) {
    return dataFiles[`metas/${folders}${name}.meta`];
  }
}

class Player extends Cat {
  constructor() {
    super();
    this.spouse = null;
  }
  setData(save, colors, dataFiles) {
    this.meta = this.getJSONFile(dataFiles, "", "parent");

    //name, accessories
    this.name = save.player_name.toLowerCase();
    this.meta.npc_accessories = save.player_accessories;

    //eyes
    this.meta.npc_colors_eyes_left = this.oleToRGB(save.player_eyes_left_color);
    this.meta.npc_colors_eyes_right = this.oleToRGB(save.player_eyes_right_color);

    //body
    for (let part of ["torso", "face", "ears", "tail"]) {
      this.meta[`npc_appearance_${part}`] = save[`player_${part}`];
    }

    //coat

    //the order of colors as they appear in the file
    let coatOrder = ["torso", "feet", "paw_front_one", "paw_front_two", "paw_back_one", "paw_back_two", "face", "stripes", "belly", "face_stripes", "muzzle", "ear_outer_left", "ear_outer_right", "ears_inner", "tail", "tail_tip", "patches_one", "patches_two", "rosettes", "nose", "point", "stripes_two", "speckles"];

    let count = 0;
    for (let pattern of coatOrder) {
      this.meta[`npc_colors_${pattern}`] = [colors[count][0], colors[count][1], colors[count][2]]; //just colors[count] will stringify to "0": 255 later on (bad)
      count++;
    }

    //spouse
    let spouse = save.most_recent_spouse_uid;
    save.npcs[spouse].is_married == ("1.0" || "1" || "true") ? (this.spouse = spouse) : (this.spouse = null);

    //birthday
    this.meta.npc_birthday_season = save.player_birthday_season;
    this.meta.npc_birthday_day = save.player_birthday_day;

    //voice
    this.meta.npc_cat_voice = parseInt(save.player_meow_index.replace("Cat Voice ", ""));
    this.meta.npc_cat_voice_pitch_modifier = parseFloat(save.player_meow_pitch_shift.toFixed(1));
  }
}

class Sibling extends Cat {
  constructor(num) {
    super();
    this.num = num;
    this.parent = parent;
    this.relatives = [];
    this.portraits = [];
  }
  async createPortrait(dataFiles) {
    let files = [];
    let colors = [];
    //parts that actually appear in a portrait
    let path = `portraits/${this.num.toLowerCase()}/`; //path will be like: data/portraits/one/torso.png
    let partNames = ["torso", "face", "point", "ear_outer_right", "ear_outer_left", "ears_inner", "belly", "patches_one", "patches_two", "stripes_two", "stripes", "rosettes", "speckles", "face_stripes", "muzzle", "eyes_right", "eyes_left", "nose"];
    //other patterns will be skipped if they do not differ from base color, but these are always required for a complete portrait
    let mustHave = ["torso", "face", "ear_outer_left", "ears_inner", "muzzle", "eyes_right", "eyes_left", "nose"];

    for (let part of partNames) {
      //first item is temporary until i have files for each part
      if (dataFiles[`${path}${part}.png`] && (mustHave.includes(part) || this.meta[`npc_colors_${part}`].toString() != this.meta[`npc_colors_torso`].toString())) {
        files.push(dataFiles[`${path}${part}.png`]);
        colors.push(this.meta[`npc_colors_${part}`]);
      }
    }
    //add parts of the portrait that arent parts of the sprite
    files.push(dataFiles[`${path}ear_tufts.png`]);
    colors.push(colors[0]); //use torso color for now, maybe more sophisticated later
    files.push(dataFiles[`${path}eye_shine.png`]);
    colors.push([255, 255, 255]);
    files.push(dataFiles[`${path}whiskers.png`]);
    colors.push([255, 255, 255]);
    this.portraits.push(await assemblePortrait(files, colors));
  }
  setData(save, relatives, dataFiles) {
    this.meta = this.getJSONFile(dataFiles, "sibling/", `${this.num}`);
    this.relatives = relatives;

    //name, parent, accessories
    this.name = save[`kitten_${this.num}_name`].toLowerCase();
    this.parent = save.kittens_parent;
    this.meta.npc_accessories = save[`kitten_${this.num}_accessories_list`];

    //birthday
    this.meta.npc_birthday_season = save.kittens_birthday_season;
    this.meta.npc_birthday_day = save.kittens_birthday_day;

    //skills
    this.meta.npc_buddy_system_passive_trait = save[`kitten_${this.num}_trait_passive`];
    this.meta.npc_buddy_system_active_trait = save[`kitten_${this.num}_trait_active`];

    //body
    for (let part of ["torso", "face", "ears", "tail"]) {
      this.meta[`npc_appearance_${part}`] = save[`kitten_${this.num}_${part}`];
    }

    //coat
    let patterns = ["torso", "feet", "paw_front_one", "paw_front_two", "paw_back_one", "paw_back_two", "face", "stripes", "belly", "face_stripes", "muzzle", "ear_outer_left", "ear_outer_right", "ears_inner", "tail", "tail_tip", "patches_one", "patches_two", "rosettes", "nose", "point", "stripes_two", "speckles"];

    let count = 0;
    for (let pattern of patterns) {
      this.meta[`npc_colors_${pattern}`] = this.oleToRGB(save[`kitten_${this.num}_${pattern}_color`]);
      count++;
    }

    //eyes - meta needs "eyes" but save has "eye"
    this.meta["npc_colors_eyes_left"] = this.oleToRGB(save[`kitten_${this.num}_eye_left_color`]);
    this.meta["npc_colors_eyes_right"] = this.oleToRGB(save[`kitten_${this.num}_eye_right_color`]);
  }
}

class FormerRivalKitten extends Cat {
  constructor(name) {
    super();
    this.name = name.toLowerCase();
    this.parentOne = null; //string
    this.parentTwo = null; //string
    this.relatives = [];
  }
  setData(dataFiles) {
    this.meta = this.getJSONFile(dataFiles, "frk/", this.name); //necessary to load this data to mix colors

    //define relatives & birthdays
    switch (this.name) {
      case "aster": {
        this.parentOne = "champ";
        this.parentTwo = "elli";
        break;
      }
      case "aurora":
      case "lux": {
        this.parentOne = "spark";
        this.parentTwo = "lainey";
        this.relatives.push("ember");
        this.relatives.push("fliss");
        break;
      }
      case "basil":
      case "beau":
      case "bubby": {
        this.parentOne = "bob";
        this.parentTwo = "buttercup";
        break;
      }
      case "jack": {
        this.parentOne = "krampy";
        this.parentTwo = "talon";
        break;
      }
      case "salem": {
        this.parentOne = "alabaster";
        this.parentTwo = "fliss";
        this.relatives.push("lainey");
        break;
      }
    }

    this.relatives.push(this.parentOne);
    this.relatives.push(this.parentTwo);
  }
}

class NewRivalKitten extends Cat {
  constructor(name, p1, p2) {
    super();
    this.name = name.toLowerCase();
    this.parentOne = p1; //always an instance of FormalRivalKitten
    this.parentTwo = p2; //either an instance of FormalRivalKitten or Sibling
    this.portrait = null;
  }
  async createPortrait(dataFiles) {
    let path = `portraits/nrk/`;
    let parts = [];
    let files = [];
    let colors = [];

    switch (this.name) {
      case "arin":
        parts = ["ear_outer_left", "eyes_left", "eyes_right"];
        break;
      case "joan":
        parts = ["torso"];
        break;
      case "rowan":
        parts = ["torso", "belly", "eyes_right"];
        break;
      case "briar":
        parts = ["torso", "patches_two"];
        break;
      case "breon":
        parts = ["patches_one", "eyes_left"];
        break;
      case "birdy":
        parts = ["torso"];
        break;
      case "mabel":
      case "lark":
        //neither of these need recolors
        this.portrait = dataFiles[`${path}${this.name}_static.png`];
        return;
    }
    //later i will likely be globally pushing nose, inner ears, ear tufts, etc at this point
    for (let part of parts) {
      colors.push(this.meta[`npc_colors_${part}`]); //push color at npc_colors_torso to list of colors
      files.push(dataFiles[`${path}${this.name}_${part}.png`]); //push file at "portraits/nrk/joan_torso.png" to list of files
    }
    files.push(dataFiles[`${path}${this.name}_static.png`]); //static pieces go on top - includes stuff like whiskers so dw about those
    colors.push([255, 255, 255]); //do not recolor
    this.portrait = await assemblePortrait(files, colors);
  }
  setData(dataFiles) {
    //define appearance so that the class can use it
    this.meta = this.getJSONFile(dataFiles, "nrk/", this.name); // mostly complete, save for the colors pulled from parentTwo

    //BODY:
    // Fundamentally cannot be mixed. Enter "parent" to pull from the corresponding part on p2's body or

    //STATIC COLORS:
    // Already filled out, wont be touched

    //NO MIX:
    // If a pattern should use the same color p2 uses for a certain part:
    // "npc_colors_torso": "stripes"

    //SIMPLE MIX:
    // If a pattern should evenly mix the colors their parents have for a certain part:
    // "npc_colors_torso": "mix_stripes";

    //REFERENCE:
    // If a pattern should use a mixed color that was already calculated on a different part
    // "npc_colors_torso": "mix-stripes";
    // "npc_colors_head": "ref-torso";

    //ADVANCED MIX:
    //An array that allows for mixing any amount of parts, of any different kind, from any different sources, weighted at any amount.
    //What was formerly "amix-1_torso-2_torso-50" becomes [["1","torso"],["2","torso"]]
    //At most complicated, it is something like:
    //[["1","torso",25],["2","torso"],["S",[255,255,255]],["G","stripes","auto","2","stripes"],["R","torso",10]]
    //Each index:
    //0 - source. 1 or 2 for parent 1/2, S for a static color, G for the grandparent*** (former player), or R for referencing a color already on this cat (sequential)
    //**shelved for now
    //1 - body part.
    //2 - skew. a number 0-100. if index 2 is null, skew will be an equal piece of remainder; above, 25% and 10% are defined. 100-35 = 65, / 3 items left = 22, each piece is weighted at 22%. if indexes 3+ must be defined type "auto", otherwise leave off and auto will be assumed.
    //3 - backup source. backup will trigger if source 1 does not exist (G) or if source 1's color at the specified part is equal to source 1's torso (and thus not a pattern that is actually rendered). common use would be to use the same character's stripes_two or rosettes color in the hopes that those are defined when stripes aren't. or patches2 when no patches1, etc.
    //4 - backup part, see above.

    //NOTES:
    //You will rarely need to mix more than 2, maybe 3 parts, but I want to allow for many possibilities. Mixing from a bunch of sources can give you results that feel more "random" (but will likely tend towards brown)
    //Not sure what to do if grandparent is not going to be a character but user would like the data to still be factored in.
    //For mixing (especially skew): output is not yet locked to 0-255 but need to make it so.
    //What happens if skew numbers add to more than 100? like 55/55/auto? Too big of numbers and its going to just be capped at white. I guess 55+55=110, 110/100=1.1, all values divide by 1.1 to get 50/50/0?
    //Better example: 35/25/40/40 = 140. 140/100=1.4. now 25/18/29/29. ratio stays the same, numbers scale to what is possible.
    //Not reccommended, but skew (especially with a static color) can be used to tint characters that have trouble with clashing warm/cool tones.
    //References not only save on processing power, but make there only be one thing you have to change if there are updates

    //Who is parent 1 and parent 2 will match the order they're listed in the rival marriage
    for (let [key, value] of Object.entries(this.meta)) {
      if (key.startsWith("npc_colors") && typeof value == "string") {
        //looking at a color declaration whose value is text rather than an RGB array -- value holds eyes_left or mix-eyes_left or ref-torso etc
        if (value.startsWith("mix-")) {
          //SIMPLE MIX: mix-eyes_left
          let part = value.split("-")[1]; //eyes_left
          //grab the color of the specified pattern from both parents
          let parentColors = [this.parentOne.meta[`npc_colors_${part}`], this.parentTwo.meta[`npc_colors_${part}`]];
          //mix colors
          let finalColor = [];
          for (let i in parentColors[0]) {
            finalColor.push(Math.ceil((parentColors[0][i] + parentColors[1][i]) / 2));
          }
          this.meta[key] = finalColor; //push calculated color to meta
        } else if (value.startsWith("ref-")) {
          //REFERENCE: take color from another part of this cat
          let part = value.split("-")[1]; //eyes_left
          this.meta[key] = this.meta[`npc_colors_${part}`];
        } else {
          //NO MIX: eyes_left (always from parent 2)
          this.meta[key] = this.parentTwo.meta[`npc_colors_${value}`];
        }
      } else if (key.startsWith("npc_colors") && Array.isArray(value) && value[0][0]) {
        //looking at a color declaration with a 2D array
        //ADVANCED MIX: [["1","torso",25],["2","torso"],["S",[255,255,255]],["G","stripes","auto","2","stripes"],["R","torso",10]]
        //Calculate skew first. If skew numbers are greater than 100 they have to be adjusted. Doing this first lets you push values to the mixing array all at once
        let colorDeclarations = value;
        let totalSkew = 0;
        for (let item of colorDeclarations) {
          let thisSkew = item[2]; //may be undefined if it was auto/left off
          if (thisSkew && typeof thisSkew == "number") {
            //if skew has a defined number, add value to total
            totalSkew += thisSkew;
          }
        }
        if (totalSkew > 100) {
          let skewScaler = totalSkew / 100;
          let i = 0;
          for (let item of colorDeclarations) {
            let thisSkew = item[2];
            if (thisSkew && typeof thisSkew == "number") {
              //find the same objects as last time and replace them with a scaled-down value
              colorDeclarations[i][2] = thisSkew / skewScaler;
            }
            i++;
          }
        }
        //Skews are now appropriate values that do not exceed 100
        totalSkew = 0; //recount the total
        for (let item of colorDeclarations) {
          let thisSkew = item[2];
          if (thisSkew && typeof thisSkew == "number") {
            //if skew has a defined number, add value to total
            totalSkew += thisSkew;
          }
        }
        //Calculate autos, index will be overwritten or added as needed
        let numAutos = 0;
        for (let item of colorDeclarations) {
          let thisSkew = item[2];
          if (!thisSkew || thisSkew == "auto") {
            numAutos++;
          }
        }
        for (let item of colorDeclarations) {
          let thisSkew = item[2];
          if (!thisSkew || thisSkew == "auto") {
            item[2] = 0;
            item[2] = (100 - totalSkew) / numAutos;
          }
        }
        //Now that final skews are defined for each color, can process the rest of each part all at once
        let finalColor = [0, 0, 0];
        for (let item of colorDeclarations) {
          let src = item[0];
          let part = item[1];
          let skew = item[2];
          let color = null;
          let equalsTorso = false;
          //use src & part to find a color value - will the scope be okay with this??
          let setColor = () => {
            switch (src) {
              case "1":
              case 1:
                color = this.parentOne.meta[`npc_colors_${part}`];
                equalsTorso = color.toString() == this.parentOne.meta[`npc_colors_torso`].toString() ? true : false;
                break;
              case "2":
              case 2:
                color = this.parentTwo.meta[`npc_colors_${part}`];
                equalsTorso = color.toString() == this.parentTwo.meta[`npc_colors_torso`].toString() ? true : false;
                break;
              case "S":
                color = part;
                equalsTorso = color.toString() == this.meta[`npc_colors_torso`].toString() ? true : false;
                break;
              //case "G":
              //color = this.parentTwo.parent.meta[`npc_colors_${part}`];
              //equalsTorso = color.toString() == this.parentTwo.parent.meta[`npc_colors_torso`].toString() ? true : false;
              case "R":
                color = this.meta[`npc_colors_${part}`];
                equalsTorso = color.toString() == this.meta[`npc_colors_torso`].toString() ? true : false;
            }
          };

          setColor();
          //load backups where applicable - if the color did not exist (grandparent) or this part is not visible on the source (color=source's base), assuming a backup was specified
          if (!color || (equalsTorso && item[3] && item[4])) {
            //if color is undefined OR this color is the same as the torso of the cat it was taken from / not really defined
            src = item[3];
            part = item[4];
            setColor();
            //failsafes
            color = !color ? this.meta[`npc_colors_torso`] : color; //if the backup color was undefined, set color var to the color of this cat's torso
            color = !color ? this.parentTwo.meta[`npc_colors_torso`] : color; //if this cat's torso is still undefined, set color var to their parent's torso color
          }

          //skew values
          skew = skew / 100;
          for (let i in color) {
            finalColor[i] += color[i] * skew;
          }
          for (let i in finalColor) {
            finalColor[i] = Math.min(Math.max(Math.ceil(finalColor[i]), 0), 255); //round, limit value to 0-255
          }

          this.meta[key] = finalColor; //push calculated color to meta
        }
      } else if (key.startsWith("npc_appearance") && value == "parent") {
        //looking at an appearance declaration with a value of parent
        //BODY: pull corresponding body part from parent 2
        this.meta[key] = this.parentTwo.meta[key];
      }
    }
  }
}

const assemblePortrait = async function (portraitFiles, portraitColors) {
  //files = [Uint8Array, Uint8Array]
  //colors = [[10,10,10],[5,5,5]]
  //the correct character has already been identified, these are their files
  //create an empty StaticCanvas. a normal canvas would use an actual canvas element but we're not rendering anything on the page
  let canvas = new fabric.StaticCanvas(null, {
    width: 416,
    height: 416,
  });
  for (let i in portraitFiles) {
    let r = portraitColors[i][0]; //255
    let g = portraitColors[i][1]; //200
    let b = portraitColors[i][2]; //0

    let blob = new Blob([portraitFiles[i]], { type: "image/png" }); //images are loaded as bytes so they can be zipped later, but fabric can't process that, so convert to blob
    let url = URL.createObjectURL(blob); //vehicle for the image to be sent to fabric

    //the image, loaded into fabric
    let img = await new Promise((resolve) => {
      let element = new Image();
      element.onload = () => resolve(new fabric.Image(element));
      element.src = url;
    });

    //fabric should multiply corresponding color onto layer if rgb isn't white (which would do nothing)
    //if any of these arent 255 we know its not white
    if (r != 255 || g != 255 || b != 255) {
      img.filters.push(
        new fabric.Image.filters.BlendColor({
          color: `rgb(${r},${g},${b})`,
          mode: "multiply",
        })
      );
      img.applyFilters(); //apply the specified filter
    }

    canvas.add(img); //layer recolored image onto current canvas
    URL.revokeObjectURL(url); //clear space in memory URL held
  }
  canvas.renderAll(); //render image once all layers have been recolored and added
  //https://www.reddit.com/r/learnjavascript/comments/1hqdf2v/each_time_i_think_ive_understood_promises/
  let blob = await new Promise((resolve) => canvas.lowerCanvasEl.toBlob(resolve, "image/png")); //converts canvas into blob
  let arrayBuffer = await blob.arrayBuffer(); //converts blob into binary so it can be converted into bytes
  return new Uint8Array(arrayBuffer); //converts blob into bytes/Uint8Array, which is what the zipper is capable of zipping
};
