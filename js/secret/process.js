import { PageBuilder } from "./pages/pagebuilder.js";
import { Player, Sibling, FormerRivalKitten } from "./cats.js";
import { RivalMarriage, isRelated, marriageCompleted } from "./rivalmarriage.js";
import { Den, getParentSituation } from "./dens.js";

PageBuilder.prototype.process = function () {
  //player creation & initialization ==============================================================
  let player;
  if (this.globalSettings.create == "Yes") {
    player = new Player();
    player.setData(this.save, this.colors, this.dataFiles);
  }

  //sibling creation & initialization ==============================================================
  let siblings = [];
  let dens = [];
  //repetitive, but variable assignment can't be done in parallel through an array - and i need to assign these objects to variables to check if they exists for RMs
  let one, two, three, four;
  let oneDen, twoDen, threeDen, fourDen;

  if ("one" != this.heir) {
    one = new Sibling("one");
    siblings.push(one);
    //siblingone only gets a house if their parent is divorced and needs a home
    //if parent exists and is married, they will live alongside them in their partner's home
    //if parent dne, they will live with either their step or bio parent depending on setting
    if (getParentSituation(this.heir, this.save, this.globalSettings.create) == "one") {
      oneDen = new Den("siblingoneden", this.heir, this.globalSettings, this.save, this.dataFiles, null);
      dens.push(oneDen);
    }
  }
  if ("two" != this.heir) {
    two = new Sibling("two");
    siblings.push(two);
    twoDen = new Den("siblingtwoden", this.heir, this.globalSettings, this.save, this.dataFiles, null);
    dens.push(twoDen);
  }
  if ("three" != this.heir) {
    three = new Sibling("three");
    siblings.push(three);
    threeDen = new Den("siblingthreeden", this.heir, this.globalSettings, this.save, this.dataFiles, null);
    dens.push(threeDen);
  }
  if ("four" != this.heir) {
    four = new Sibling("four");
    siblings.push(four);
    fourDen = new Den("siblingfourden", this.heir, this.globalSettings, this.save, this.dataFiles, null);
    dens.push(fourDen);
  }
  for (let sibling of siblings) {
    sibling.setData(this.save, this.globalRelatives, this.dataFiles);
  }

  //former rival kitten creation & initialization + dens for their families ==============================================================
  let aster, aurora, lux, basil, beau, bubby, jack, salem;
  let frks = [];

  //if marriage was completed, create object for the child & object for their expanded house
  if (marriageCompleted(this.save, "elliandchamp")) {
    aster = new FormerRivalKitten("aster");
    frks.push(aster);
    dens.push(new Den("elliden", this.heir, this.globalSettings, this.save, this.dataFiles, "champden"));
  }
  if (marriageCompleted(this.save, "sparkandlainey")) {
    aurora = new FormerRivalKitten("aurora");
    lux = new FormerRivalKitten("lux");
    frks.push(aurora);
    frks.push(lux);
    //shop itself does not need to be modified, but aurora & lux move out - but the name of the shop needs to be changed when this happens regardless
    //lainey has moved out in this instance. if fliss has too, house will need to be deleted, but null here to avoid repeating that. if fliss hasn't, special value to rename the den
    dens.push(new Den("auroraandluxden", this.heir, this.globalSettings, this.save, this.dataFiles, marriageCompleted(this.save, "alabasterandfliss") ? null : "flissOnly"));
  }
  if (marriageCompleted(this.save, "bobandbuttercup")) {
    basil = new FormerRivalKitten("basil");
    beau = new FormerRivalKitten("beau");
    bubby = new FormerRivalKitten("bubby");
    frks.push(basil);
    frks.push(beau);
    frks.push(bubby);
    dens.push(new Den("bobden", this.heir, this.globalSettings, this.save, this.dataFiles, "buttercupden"));
  }
  if (marriageCompleted(this.save, "alabasterandfliss")) {
    salem = new FormerRivalKitten("salem");
    frks.push(salem);
    //fliss has moved out in this instance. if lainey has too, delete old house. if lainey hasn't, special value to rename the den
    dens.push(new Den("alabasterden", this.heir, this.globalSettings, this.save, this.dataFiles, marriageCompleted(this.save, "sparkandlainey") ? "flissandlaineyden" : "laineyOnly"));
  }
  if (marriageCompleted(this.save, "krampyandtalon")) {
    jack = new FormerRivalKitten("jack");
    frks.push(jack);
    dens.push(new Den("krampyden", this.heir, this.globalSettings, this.save, this.dataFiles, "talonden"));
  }

  for (let frk of frks) {
    frk.setData(this.dataFiles);
  }

  //create rival marriages ==============================================================
  //check if both partners exist & are not related
  let rivalMarriages = [];
  if (beau && lux) {
    rivalMarriages.push(new RivalMarriage(beau, lux));
  }
  if (two && basil && isRelated(basil, two) == false) {
    rivalMarriages.push(new RivalMarriage(basil, two));
  }
  if (three && salem && isRelated(salem, three) == false) {
    rivalMarriages.push(new RivalMarriage(salem, three));
  }
  if (four && jack && isRelated(jack, four) == false) {
    rivalMarriages.push(new RivalMarriage(jack, four));
  }

  //create kittens for each RM
  let nrks = [];
  for (let rm of rivalMarriages) {
    rm.createKittens(this.dataFiles);
    for (let nrk of rm.kittens) {
      nrks.push(nrk);
    }
  }

  //LAST STEP, only do when everything is done and ready to build
  let catObjects = [];
  for (let cat of [player, siblings, frks, nrks].flat()) {
    catObjects.push(cat);
  }
  let denObjects = [];
  for (let den of dens) {
    if (den) {
      denObjects.push(den);
    }
  }
  console.log("Here are the cat objects:");
  console.log(catObjects);
  console.log("Here are the den objects:");
  console.log(denObjects);
  return { catObjects: catObjects, denObjects: denObjects };
};
