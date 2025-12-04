"use strict";

import { PageBuilder } from './pagebuilder.js';
import './home.js';
import './settings.js';
import './upload.js';
import './questions.js';
import './download.js';

window.onload = function() {
  const pages = new PageBuilder();
  pages.homePage();
};

//element.innerHTML = "blah";
//element.classList.add()
//element.setAttribute("href", "hi.com")
//parent = element.parentNode
