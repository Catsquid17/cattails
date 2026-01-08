"use strict";

import { PageBuilder } from "./pages/pagebuilder.js";
import "./pages/home.js";
import "./pages/settings.js";
import "./pages/upload.js";
import "./pages/questions.js";
import "./pages/download.js";
import "./process.js";

window.onload = async function () {
  let dataFiles = await loadFiles(); //load files before doing anything else
  const pages = new PageBuilder(dataFiles);
  pages.homePage();
};

const loadFiles = async () => {
  //all will start with data/secret/
  let paths = ["metas/parent.meta", "portraits/nrk/arin_ear_outer_left.png", "portraits/nrk/arin_eyes_left.png", "portraits/nrk/arin_eyes_right.png", "portraits/nrk/birdy_torso.png", "portraits/nrk/breon_eyes_left.png", "portraits/nrk/breon_patches_one.png", "portraits/nrk/briar_torso.png", "portraits/nrk/briar_patches_two.png", "portraits/nrk/joan_torso.png", "portraits/nrk/rowan_belly.png", "portraits/nrk/rowan_eyes_right.png", "portraits/nrk/rowan_torso.png"];
  //npc metas ================================================
  let frks = ["aster", "aurora", "basil", "beau", "bubby", "jack", "lux", "salem"];
  let nrks = ["arin", "birdy", "breon", "briar", "joan", "lark", "mabel", "rowan"];
  for (let cat of frks) {
    paths.push(`metas/frk/${cat}.meta`);
  }
  for (let cat of nrks) {
    paths.push(`metas/nrk/${cat}.meta`);
    paths.push(`portraits/nrk/${cat}_static.png`);
  }
  //dens =====================================================
  let buildings = ["alabaster", "auroraandlux", "bob", "buttercup", "champ", "elli", "emberandspark", "flissandlainey", "krampy", "talon"];
  let decor = ["alabaster", "auroraandlux", "bob", "elli", "fliss", "lainey"];
  let regions = ["alabaster", "auroraandlux", "bob", "elli", "emberandspark", "krampy"];
  for (let den of buildings) {
    paths.push(`dens/buildings/${den}den.meta`);
  }
  for (let den of decor) {
    paths.push(`dens/buildings/decor_${den}.png`);
  }
  for (let den of regions) {
    paths.push(`dens/map/${den}den.region`);
  }
  //siblings ======================================================
  for (let num of ["one", "two", "three", "four"]) {
    for (let style of ["I", "O"]) {
      //siblingone does not have a solo den
      num != "one" ? paths.push(`dens/buildings/sibling${num}den-${style}.meta`) : null;
      num != "one" ? paths.push(`dens/map/sibling${num}den-${style}.region`) : null;
      //parent can only live with one or four
      num == ("one" || "four") ? paths.push(`dens/buildings/sibling${num}den-${style}P.meta`) : null;
      num == ("one" || "four") ? paths.push(`dens/map/sibling${num}den-${style}P.region`) : null;
    }

    paths.push(`dens/buildings/decor_sibling${num}.png`);
    paths.push(`metas/sibling/${num}.meta`);
    let portraitParts = ["torso", "belly", "ear_tufts", "eyes_left", "eyes_right", "eye_shine", "face_stripes", "ears_inner", "muzzle", "nose", "ear_outer_left", "ear_outer_right", "patches_one", "patches_two", "point", "stripes", "whiskers", "stripes_two", "face", "rosettes", "speckles"];
    for (let part of portraitParts) {
      paths.push(`portraits/${num}/${part}.png`);
    }
  }
  //==============================================================
  let dataFiles = {};

  //for each path i have defined
  for (let path of paths) {
    const res = await fetch(`../../../data/secret/${path}`); //fetch the item at that path, store the data/response

    let fileContent = null;
    if (path.endsWith(".png")) {
      fileContent = new Uint8Array(await res.arrayBuffer()); //need to load an image as bytes to zip it later... if recolorer wants something different use blob (binary)
    } else {
      fileContent = await res.json(); //if its not an image, it's a JSON
    }

    dataFiles[path] = fileContent;
  }

  return dataFiles;
};
