import { Player, Sibling, NewRivalKitten, FormerRivalKitten } from "./cats.js";
//https://github.com/101arrowz/fflate

//https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export class Mod {
  constructor(save, dataFiles) {
    this.name = "Someone's New Game+";
    this.files = {}; //"Test/1/1.txt": save.player_name  -- structure
    this.save = save;
    this.heirName = "";
    this.heirPersonality = "";
    this.dataFiles = dataFiles;
  }
  buildMod(heir, objectsToBuild) {
    console.log(this.dataFiles);
    this.getModName(heir);
    let cats = objectsToBuild.catObjects;
    let dens = objectsToBuild.denObjects;
    for (let cat of cats) {
      let skipList = ["jack", "salem", "aster", "aurora", "lux", "bubby", "beau", "basil"]; //TEMPORARY until i actually make content for them
      if (!skipList.includes(cat.name)) {
        this.buildMeta(cat);
        this.buildLang(cat);
        this.buildPortraits(cat);
      }
    }
    for (let den of dens) {
      this.buildDen(den);
    }
    this.buildMisc();
    this.buildReadMe();
    console.log(this.files);
  }
  getModName(heir) {
    switch (heir) {
      case "one":
        this.heirName = this.save.kitten_one_name;
        this.heirPersonality = "adventurous";
        break;
      case "two":
        this.heirName = this.save.kitten_two_name;
        this.heirPersonality = "creative";
        break;
      case "three":
        this.heirName = this.save.kitten_three_name;
        this.heirPersonality = "friendly";
        break;
      case "four":
        this.heirName = this.save.kitten_four_name;
        this.heirPersonality = "timid";
        break;
    }
    this.name = `${this.heirName}'s New Game+ v1.0`;
  }
  getFileName(cat) {
    if (cat instanceof Player) {
      return "parent";
    } else if (cat instanceof Sibling) {
      return `sibling${cat.num}`;
    } else {
      return cat.name;
    }
  }
  getLangName(name) {
    let properName = name.toProperCase();
    let names = [this.save.player_name.toProperCase(), this.save.kitten_one_name.toProperCase(), this.save.kitten_two_name.toProperCase(), this.save.kitten_three_name.toProperCase(), this.save.kitten_four_name.toProperCase()];
    if (names.includes(properName)) {
      switch (properName) {
        case "Arin":
          if (!names.includes("Armin")) {
            return "Armin";
          } else if (!names.includes("Alphonse")) {
            return "Alphonse";
          } else {
            return properName;
          }
        case "Joan":
          if (!names.includes("Jess")) {
            return "Jess";
          } else if (!names.includes("Gemma")) {
            return "Gemma";
          } else {
            return properName;
          }
        case "Rowan":
          if (!names.includes("Roman")) {
            return "Roman";
          } else if (!names.includes("Warren")) {
            return "Warren";
          } else {
            return properName;
          }
        case "Briar":
          if (!names.includes("Bee")) {
            return "Bee";
          } else if (!names.includes("Bumblebee")) {
            return "Bumblebee";
          } else {
            return properName;
          }
        case "Breon":
          if (!names.includes("Baron")) {
            return "Baron";
          } else if (!names.includes("Braxton")) {
            return "Braxton";
          } else {
            return properName;
          }
        case "Birdy":
          if (!names.includes("Chirp")) {
            return "Chirp";
          } else if (!names.includes("Raven")) {
            return "Raven";
          } else {
            return properName;
          }
        case "Lark":
          if (!names.includes("Chickadee")) {
            return "Chickadee";
          } else if (!names.includes("Budgie")) {
            return "Budgie";
          } else {
            return properName;
          }
        case "Mabel":
          if (!names.includes("Maisie")) {
            return "Maisie";
          } else if (!names.includes("Mae")) {
            return "Mae";
          } else {
            return properName;
          }
        default:
          return name;
      }
    } else {
      return properName;
    }
  }
  buildMeta(cat) {
    let meta = {};
    for (let key of metaKeys) {
      meta[key] = cat.meta[key];
    }
    let fileName = this.getFileName(cat);
    this.files[`${this.name}/npcs/${fileName}.meta`] = JSON.stringify(meta, null, 2);
  }
  buildLang(cat) {
    let lang = {};
    lang["lang_npc_name"] = cat instanceof NewRivalKitten ? this.getLangName(cat.name) : cat.name.toProperCase();
    for (let key of [cat.meta["intro_dialog_objects"], cat.meta["dialog_objects"]].flat()) {
      lang[key["dialog_lang_key"]] = "WIP";
    }
    lang["lang_dialog_error"] = "WIP";
    let fileName = this.getFileName(cat);
    this.files[`${this.name}/npcs/lang/english/${fileName}.lang`] = JSON.stringify(lang, null, 4);
  }
  buildPortraits(cat) {
    if (cat instanceof Sibling) {
      this.files[`${this.name}/npcs/portraits/sibling${cat.num}neutral.png`] = cat.portraits[0]; //0 for now itll iterate thru emotions later
    } else if (cat instanceof NewRivalKitten) {
      this.files[`${this.name}/npcs/portraits/${cat.name}neutral.png`] = cat.portrait;
    } else if (cat instanceof FormerRivalKitten) {
      //just load the images from the files
    }
  }
  buildDen(den) {
    this.files[`${this.name}/buildings/${den.denName}.meta`] = JSON.stringify(den.getFile(this.dataFiles, "buildings/", den.getFileName(), "meta"), null, 2);
    this.files[`${this.name}/buildings/lang/english/${den.denName}.lang`] = `{\n\t"lang_building_name": "${den.langName}"\n}`;
    //clinic decor does not change
    den.getDecorName() != "decor_clinic" ? (this.files[`${this.name}/buildings/sprites/${den.getDecorName()}.png`] = den.getFile(this.dataFiles, "buildings/", den.getDecorName(), "png")) : null;

    this.files[`${this.name}/map/${den.denName}.region`] = JSON.stringify(den.getFile(this.dataFiles, "map/", den.getFileName(), "region"), null, 2);
    this.files[`${this.name}/map/lang/english/${den.denName}.lang`] = `{\n\t"lang_region_name": "${den.langName}"\n}`;
    if (den.collateral) {
      if (den.collateral == "flissOnly" || den.collateral == "laineyOnly") {
        //rename den so that only one of them lives there
        let flissOrLainey = den.collateral.replace("Only", "").toProperCase();
        let flBuilding = den.getFile(this.dataFiles, "buildings/", "flissandlaineyden", "meta");
        //re-enable the values that typically disable a den, fix lock list & lock sentence
        flBuilding.unlocked = true;
        flBuilding.build_menu = true;
        flBuilding.npc_lock_list = [flissOrLainey.toLowerCase];
        this.files[`${this.name}/buildings/${den.denName}.meta`] = JSON.stringify(flBuilding, null, 2);
        this.files[`${this.name}/buildings/lang/english/flissandlaineyden.lang`] = `{\n\t"lang_building_name": "${flissOrLainey}'s Den"\n}`;
        this.files[`${this.name}/buildings/sprites/decor_flissandlainey.png`] = den.getFile(this.dataFiles, "buildings/", `decor_${flissOrLainey.toLowerCase()}`, "png");
        this.files[`${this.name}/map/lang/english/flissandlaineyden.lang`] = `{\n\t"lang_region_name": "${flissOrLainey}'s Den"\n}`;
      } else {
        //disable old den
        this.files[`${this.name}/buildings/${den.collateral}.meta`] = JSON.stringify(den.getFile(this.dataFiles, "buildings/", den.collateral, "meta"), null, 2);
      }
    }
  }
  buildMisc() {
    //things that are less conditional, that impact the world rather than any particular object
    //the shop den itself is never modified, but Spark will always take over it, even if they never married
    this.files[`${this.name}/buildings/lang/english/emberandsparkden.lang`] = `{\n\t"lang_building_name": "Spark's Shop"\n}`;
    this.files[`${this.name}/map/lang/english/emberandsparkden.lang`] = `{\n\t"lang_region_name": "Spark's Shop"\n}`;
  }
  buildReadMe() {
    const d = new Date();
    let dateString = `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
    const readMe = `This is a custom mod created by Catsquid's NG+ Mods maker at https://catsquid17.github.io/cattails/. This mod grows up the second generation of cats to expand upon the New Game+ experience.

This mod was created to be used with ${this.heirName}, ${this.save.player_name}'s ${this.heirPersonality} kitten. It was created on ${dateString} at [insert time later].
It is important that you only play on ${this.heirName}'s save file while this mod is installed. Please drag it out of the mods folder when you want to switch files.

If you play on another file with this mod installed, unexpected behavior may occur. Your save wouldn't get corrupted or otherwise broken, but significant progress may be lost.
If you play on ${this.heirName}'s file WITHOUT this mod after making progress with it, you may lose all progress with this mod.
Please make backups of your save files if you intend to experiment.

If you need help installing the mod, there is a tutorial here: www.youtube.com
If that doesn't help, feel free to contact me. I can be found on Nexus and the offical Cattails Forums.
Nexus: https://www.nexusmods.com/profile/Catsquid17
Forums: https://cattailsgame.proboards.com/user/434

Likewise, if you encounter a bug with the mod, found a typo, have a suggestion, etc., feel free to contact me!

If you need help with modded content, there is a guide written at the end of this file. It will tell you everyone's schedules, birthdays, event locations, likes/dislikes, and so on!
BEWARE: The guide spoils literally every aspect of the mod, so I would only check it if I was really stuck.
\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n
===============================================================================================================
WARNING: MAJOR SPOILERS FOR THE MOD ARE BELOW!
===============================================================================================================
Your mod was generated with 4 out of 4 rival marriages. Less marriages may have been generated if your family is related to the cats who would normally be their partners.
The existing rival marriages and their kittens are as follows:

Beau x Lux - 1 kitten, born on Autumn 6
Salem x ${this.save.kitten_two_name} - 3 kittens, born on Spring 3
Basil x ${this.save.kitten_three_name} - 2 kittens, born on Summer 5
Jack x ${this.save.kitten_four_name} - 2 kittens, born on Winter 9

The kittens will be described in detail below.\n\n\n\n\n\n\n\n\n\n\n\n

========================= MABEL ==========================
Parents: Beau and Lux
Birthday: Autumn 6
Schedule: 
\tWake up at 0 AM, in Lux's house
\tRun around for 10 hours
\tGo to bed at 0 AM

Loves: Stuff
Likes: Stuff
Dislikes: Stuff
Hates: Stuff
`;
    this.files[`${this.name}/README.txt`] = readMe;
  }
}

const metaKeys = [
  "npc_enabled",
  "npc_type",
  "npc_cat_voice",
  "npc_cat_voice_pitch_modifier",
  "npc_loyalty",
  "npc_map_uid",
  "npc_x",
  "npc_y",
  "npc_direction",
  "npc_schedule",
  "npc_buddy_system_enabled",
  "npc_is_befriendable",
  "npc_is_datable",
  "npc_can_be_festival_opponent",
  "npc_appearance_torso",
  "npc_appearance_face",
  "npc_appearance_ears",
  "npc_appearance_tail",
  "npc_accessories",
  "npc_colors_torso",
  "npc_colors_feet",
  "npc_colors_paw_front_one",
  "npc_colors_paw_front_two",
  "npc_colors_paw_back_one",
  "npc_colors_paw_back_two",
  "npc_colors_face",
  "npc_colors_stripes",
  "npc_colors_stripes_two",
  "npc_colors_face_stripes",
  "npc_colors_belly",
  "npc_colors_muzzle",
  "npc_colors_eyes_left",
  "npc_colors_eyes_right",
  "npc_colors_ear_outer_left",
  "npc_colors_ear_outer_right",
  "npc_colors_ears_inner",
  "npc_colors_tail",
  "npc_colors_tail_tip",
  "npc_colors_patches_one",
  "npc_colors_patches_two",
  "npc_colors_rosettes",
  "npc_colors_nose",
  "npc_colors_point",
  "npc_colors_speckles",
  "npc_birthday_season",
  "npc_birthday_day",
  "npc_starting_friendship_rank",
  "npc_item_loves",
  "npc_item_likes",
  "npc_item_dislikes",
  "npc_item_hates",
  "npc_item_gifts",
  "intro_dialog_objects",
  "dialog_objects",
];
