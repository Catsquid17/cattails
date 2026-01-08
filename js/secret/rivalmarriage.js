export { RivalMarriage, isRelated, marriageCompleted };
import { NewRivalKitten } from "./cats.js";

class RivalMarriage {
  constructor(partnerOne, partnerTwo) {
    this.partnerOne = partnerOne; //always an instance of FormalRivalKitten
    this.partnerTwo = partnerTwo; //either an instance of FormalRivalKitten or Sibling
    this.kittens = [];
  }
  createKittens(files) {
    let p1 = this.partnerOne.name;
    let p2 = this.partnerTwo.name;
    let num = this.partnerTwo.num ? this.partnerTwo.num : null; //if there is a num property of p1
    let names = [];
    if (p1 == "beau" && p2 == "lux") {
      names.push("mabel");
    } else if (p1 == "basil" && num == "two") {
      names.push("breon");
      names.push("briar");
    } else if (p1 == "salem" && num == "three") {
      names.push("arin");
      names.push("joan");
      names.push("rowan");
    } else if (p1 == "jack" && num == "four") {
      names.push("birdy");
      names.push("lark");
    }

    for (let name of names) {
      this.kittens.push(new NewRivalKitten(name, this.partnerOne, this.partnerTwo));
    }
    for (let kitten of this.kittens) {
      kitten.setData(files);
    }
  }
}

const isRelated = (one, two) => {
  for (let cat of one.relatives) {
    if (two.relatives.includes(cat)) {
      return true;
    }
  }
  return false;
};

const marriageCompleted = (save, marriage) => {
  return save.rival_marriages_completed.includes(marriage) ? true : false;
};
