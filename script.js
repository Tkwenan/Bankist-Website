"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

//for (let i = 0; i < btnsOpenModal.length; i++)
//  btnsOpenModal[i].addEventListener("click", openModal);

//we rewrite the above for-loop using forEach()
//btnsOpenModal is a node list -> the result of querySelectorAll() above
//a node list is not an array, but it has the forEach method available on it like arrays
//we use the forEach loop to add an event listener to each of the buttons
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener("click", function (e) {
  //first get the coordiantes of the section that we want to scroll to
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  //e.target is the button that was clicked
  //console.log(e.target.getBoundingClientRect());

  console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);

  console.log(
    "height/width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //Scrolling
  //first argument is the left position - in this case its zero which is good bc we don't want any horizontal scroll
  //the second argument is the top position
  //window.scrollTo(
  // s1coords.left + window.pageXOffset,
  //  s1coords.top + window.pageYOffset
  //);

  //window.scrollTo({
  // left: s1coords.left + window.pageXOffset,
  // top: s1coords.top + window.pageYOffset,
  // behavior: "smooth",
  //});

  //A more modern way of doing it
  //only works in modern browsers
  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
// Page navigation
//we first implement it without using event delegation
//.querySelectorAll returns a node list and we attach an event handler
//to each of the element on the node list
//document.querySelectorAll(".nav__link").forEach(function (el) {
//  el.addEventListener("click", function (e) {
//    e.preventDefault();

//'this' is the current element
//if we have href="#section--1", the line below will return
//the part in quotation marks
//    const id = this.getAttribute("href");
//    document.querySelectorAll(id).scrollIntoView({ behavior: "smooth" });
// });
//});
//this works fine, but it's not efficient because we're adding he exact same callback function/event handler once to each of the elements. This would be extrememly inefficient if we had say 10k elements. The better solution is to use events delegation

//Smooth scrolling with event delegation
// 1. Add event listener to common parent element
// 2. Determine what element the event originated from
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains("nav__link")) {
    //if we have href="#section--1", the line below will return
    //the part in quotation marks
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////
//Tabbed component

//we could use a forEach loop to attach event handlers to each element in 'tabs', but that's not good practice
//instead, we use event delegation
//for event delegation, we need to attach the event handler to the common parent element of the elements that we're interested in
//in our case, the tabContainer
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  //remove the active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  //Activate tab
  //the tab that's clicked has a different style
  //so we immediately update its style
  clicked.classList.add("operations__tab--active");

  //Activating content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////
//Menu Fade animation
/*
nav.addEventListener("mouseover", function (e) {
  if (e.target.classList.contains("nav__link")) {
    const clickedLink = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    //change the opacity of the siblings of the selected link
    siblings.forEach((el) => {
      //check that the current element is not the selected link itself
      if (el !== link) el.style.opacity = 0.5;
    });

    logo.style.opacity = 0.5;
  }
});

//need to undo what we did above such that when we hover out
//the sibling links' opacity go back to the original of 0.1
nav.addEventListener("mouseout", function (e) {
  if (e.target.classList.contains("nav__link")) {
    const clickedLink = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    //change the opacity of the siblings of the selected link
    siblings.forEach((el) => {
      //check that the current element is not the selected link itself
      if (el !== link) el.style.opacity = 1;
    });

    logo.style.opacity = 1;
  }
});
*/

//we refactor the code above into a new function
const handleHover = function (e) {
  //either 1 or 0.5
  console.log(this);
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    //change the opacity of the siblings of the selected link
    siblings.forEach((el) => {
      //check that the current element is not the selected link itself
      //if (el !== link) el.style.opacity = 0.5;
      if (el !== link) el.style.opacity = this;
    });

    //logo.style.opacity = 0.5;
    logo.style.opacity = this;
  }
};

/*
nav.addEventListener("mouseover", function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener("mouseout", function (e) {
  handleHover(e, 1);
});
*/
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

/*
///////////////////////////////////////
// Sticky Navigation: Scroll event
const initialCoords = section1.getBoundingClientRect();

window.addEventListener("scroll", function () {
  //get our current scroll position
  console.log(window.scrollY);

  if (this.window.scrollY > initialCoords.top) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
});
*/

//////////////////////////////////////
// Sticky Navigation: Intersection Observer API

/*
// First experimenting with the Observer API
//called each time that the observed element i.e. our target element
//is intersecting the root element at the threshold that we defined
//whether we're scrolling up or down
const obsCallback = function (entries, observer) {
  entries.forEach((entry) => {
    console.log(entry);
  });
};

const obsOptions = {
  //the element that the target is intersecting
  //when set to null, by default the viewport is our root element
  root: null,

  //the % of intersection at which the observer callback function will be called
  threshold: 0.1,
};
*/

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  //same as writing const entry = entries[0]
  const [entry] = entries;

  //when the target is not intersecting the root, apply the sticky class
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,

  //a box of 90 pixels that will be applied outside of our target element
  //90 is the height of our navigation bar
  //basically, when our target is left with 90 px before completely exiting the viewport, we want our navigation bar to appear and become sticky
  //rootMargin: "-90px",

  //we calculate the height dynamically above -> navHeight
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//////////////////////////////////////
//Reveal Sections on Scroll
const allSections = document.querySelectorAll(".section");

//these parameters can have any name but these are the standard
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");

  //unobserve
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//////////////////////////////////////
// Lazy Loading Images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace the src attribute with the data-src one
  //dataset is where the special data properties are stored
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  //first slide should be at 0%, the second at 100%, third at 200%
  //we rewrite this below on line 378 after refactoring the code into the goToSlide function
  //slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //similar to activating the active tab
  //we select all the dots and then activate one when it's clicked
  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //rewriting
  //goToSlide(0);

  /*
//Next slide
btnRight.addEventListener("click", function () {
  //return to the first slide once we get to the end
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  //we refactor this into the goToSlide function
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
  );
  

  goToSlide(curSlide);
});
// if curSlide = 1, in the first iteration i = 0, 0 - 1 = -1
//and -1 * 100 = -100 etc.
//-100%, 0%, 100%, 200%
*/

  //we refactor next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();

    //could also implement it as a short circuit
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      //const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////////////////////////////////
// Selecting, Creating and Deleting Elements
//Selecting Elements
//select the entire document
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

//returns the first element that matches the selector
//const header = document.querySelector(".header");

//if we want to select multiple elements with the same selector
//selects all the elements with the class 'section'
//returns a node list which contains all the elements that are sections
//const allSections = document.querySelectorAll(".section");

document.getElementById("section--1");

//this method returns an HTML collection
//different from a node list. It's a live collection
//which means that if the DOM changes, then this collection is updated automatically
//e.g. if we deleted a button in the HTML code, the allButtons variable will be updated
const allButtons = document.getElementsByTagName("button");

console.log(document.getElementsByClassName("btn"));

//Creating and Inserting Elements
// .insertAdjacentHTML

//createElement() returns a DOM object that represents an element
//if we want to add this element to our page, we have to manually insert it
const message = document.createElement("div");
message.classList.add("cookie-message");

//can use the textContent and innerHTML properties to read and to set content
//message.textContent = "We use cookies for improved functionality and analytics";
message.innerHTML =
  'We use cookies for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>';

//we insert the element by appending it to the header element
//prepending adds the element as the first child of the header element
//append then moves it to the bottom of the page
//header.prepend(message);
header.append(message);

//if we wanted to insert multiple copies of the same element
//we'd have to clone the element.
//this and the prepend above will have the message appear both at the top and at the bottom of the page
//header.append(message.cloneNode(true));

//header.before(message);
//header.after(message);

//Deleting Elements
//want to delete the message element once the user clicks the 'Got it' button
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    //no need to select the cookie-message element because we already have it stored in a variable
    //otherwise, we'd have
    //document.querySelector(".cookie-message").remove();
    message.remove();
  });

///////////////////////////////////////
// Styles, attributes and Classes
//Styles
//To set a style on an element, we get the element
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

//reading a style like below only works fo inline style i.e.
//styles that we set ourselves
//won't work for styles that e.g. are hidden in a CSS class
console.log(message.style.height); //doesn't work
console.log(message.style.backgroundColor); //works because we set the background color above

//instead
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

//CSS custom properties, also called CSS variables
document.documentElement.style.setProperty("--color-primary’, ‘orangered");

//Attributes
const logo = document.querySelector(".nav__logo");

//these are standard attributes that are expected to be on an image
//so we can read them like this
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

//this is an non-standard attribute that we've added ourselves
//so we can't read it out this way
console.log(logo.desinger);

//instead
console.log(logo.getAttribute("desinger"));

//can also set attributes
logo.alt = "Beautiful minimalist logo";
logo.setAttribute("company", "Bankist");

console.log(logo.src); //absolute src url
console.log(logo.getAttribute("src")); //relative source url

const link = document.querySelector(".twitter-link");
console.log(link.href);
console.log(link.getAttribute("href"));

//Data attributes
//note that the attribute name in the html file is data-version-number
//but just like property names, when referencing attribute names in JS
//we have to use camel case
console.log(logo.dataset.versionNumber);

///Classes
//these are the important methods wrt classes
logo.classList.add("c");
logo.classList.remove("c");
logo.classList.toggle("c");
logo.classList.contains("c");

/////////////////////////////////////////////////////
//Types of events and event handlers
//Mouse Enter event
//addEventListener is the more modern way of adding an event listener to an element
const h1 = document.querySelector("h1");
//h1.addEventListener("mouseenter", function (e) {
//  alert("You are reading the heading");
//});

//The old way of attaching an event listener to an element
//use the onevent property on the element, where you substitute the
//event with the actual event
h1.onmouseenter = function (e) {
  alert("You are reading the heading");
};

//removing an event listener
const alertH1 = function (e) {
  alert("You are reading the heading");

  //remove event listener after handling the event
  h1.removeEventListener("mouseenter", alertH1);
};

h1.addEventListener("mouseenter", alertH1);

////Event Propagation in Practice
//a random color is just rgb(45, 67, 255)
//the values within the parentheses need to be anywhere between 0 and 255

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector(".nav__link").addEventListener("click", function (e) {
  //this points to the target element
  this.style.backgroundColor = randomColor();
  console.log("LINK", e.target, e.currentTarget);
});

//parent elements
document.querySelector(".nav__links").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("LINK", e.target, e.currentTarget);
});

document.querySelector(".nav").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("LINK", e.target, e.currentTarget);
});

//////////////////////////////////////////////////
//DOM Traversing
const h1 = document.querySelector("h1");

//Going downwards -> selecting child elements
//querySelectorAll() also works on elements
//selects all the elements with the highlight class that are children of the h1 element
//this works no matter how deeply nested these children are inside the h1 element
//in this case, a node list with only 2 children is logged to the console
//if there were other elements with the 'highlight' class on the page
//they will not be selected because they're not children of the h1 element
console.log(h1.querySelectorAll(".highlight"));

//to select only direct child nodes
//nodes can be anything i.e.text, comments, and elements
console.log(h1.childNodes);

//most times we're only interested in the elements themselves
//this gives an HTML collection with only the elements that are inside h1
//a HTML collection which is a live i.e. is updated as the page updates.
//works only for direct children
console.log(h1.children);

//first child element
h1.firstElementChild.style.color = "white";
h1.lastElementChild.style.color = "orangered";

//Going upwards -> selecting parents
//selecting direct parent nodes
console.log(h1.parentNode);
console.log(h1.parentElement);

//might need to find a parent element that's not a direct parent
//imagine that we had multiple elements with the 'header' class
//but we only want to find one that's a parent element of h1
//the closest() method receives a query string just like query selector
//and returns the closest parent element to the h1 element with that class
//if the selector in the parentheses matches the element on which we're calling
//the closest() method, then that's the element that will be returned
h1.closest(".header").style.background = "var(--gradient-secondary)";

// Going sideways -> selecting siblings
//in JS, we can only access direct siblings i.e.
//only the previous and the next one
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

//the sibling property for nodes
console.log(h1.previousSibling);
console.log(h1.nextSibling);

//if we need all the siblings and not the previous or the next one
//then we can move to the parent and then read all the children from there
console.log(h1.parentElement.children);

//returns an array collection which isn't an array but is an iterable
//so we can iterate through the elements and do something with each
//we want to manipulate a style for all the siblings except the element itself
[...h1.parentElement.children].forEach(function (el) {
  //can compare elements just like we'd compare numbers
  if (el !== h1) el.style.transform = "scale(0.5)";
});

document.addEventListener("DOMContentLoaded", function (e) {
  console.log("HTML parsed and DOM tree built", e);
});

window.addEventListener("load", function (e) {
  console.log("Page fully loaded", e);
});

//window.addEventListener("beforeunload", function (e) {
//  e.preventDefault();
//  console.log(e);

//display the prompt
//  e.returnValue = " ";
//});
*/
