// Get the header element
const header = document.getElementById("header");
const userName = localStorage.getItem("userName");

// Create container div
const containerDiv = document.createElement("div");
containerDiv.classList.add("container");

// Create logo
const logoDiv = document.createElement("div");
logoDiv.classList.add("logo");
const logoLink = document.createElement("a");

if ("/client/index.html" === location.pathname) logoLink.href = "index.html";
else logoLink.href = "../index.html";
const isAdmin = localStorage.getItem("isAdmin");

const logoText = document.createElement("h4");
logoText.textContent = "resource ";
const spanElement = document.createElement("span");
spanElement.textContent = "hub";
logoText.appendChild(spanElement);
logoLink.appendChild(logoText);
logoDiv.appendChild(logoLink);
containerDiv.appendChild(logoDiv);

// Create navigation
const navDiv = document.createElement("nav");
navDiv.classList.add("nav");
navDiv.setAttribute("data-visibility", "false");

const ulElement = document.createElement("ul");
ulElement.classList.add("links");

//return the required links for each page
let navLinks;

navLinks = [
  { name: "location", link: "../../client/html/location.html" },
  { name: "TA directory", link: "../../client/html/TA-directory.html" },
  { name: "Courses", link: "../../client/html/selectCourse.html" },
  { name: "Schedules", link: "../../client/html/groupSchedule.html" },
  { name: "Grade Calc", link: "../../client/html/gradesToPass.html" },
  { name: "GPA calc", link: "../../client/html/GPACalculator.html" },
  { name: "Key Links", link: "../../client/html/resource gateway.html" },
];
navLinks.forEach((item) => {
  const liElement = document.createElement("li");
  const aElement = document.createElement("a");
  aElement.href = item.link;
  aElement.textContent = item.name;

  if (item.name == "logout" && userName === null) {
    aElement.textContent = "login";
  }

  if (item.name === "logout") aElement.id = "logout";
  liElement.appendChild(aElement);
  ulElement.appendChild(liElement);
});

navDiv.appendChild(ulElement);
containerDiv.appendChild(navDiv);

// Create avatar
const avatar = document.createElement("a");
const imgElement = document.createElement("img");

if ("/client/index.html" === location.pathname) {
  imgElement.src = "images/profile pic2.svg";
} else imgElement.src = "../images/profile pic2.svg";
avatar.classList.add("avatar");

avatar.appendChild(imgElement);
containerDiv.appendChild(avatar);
const avatarDropdown = document.createElement("div");
avatarDropdown.classList.add("avatar-dropdown");

let dropdownItems = [
  { name: "Profile", link: "../../client/html/profilePage.html" },
  { name: "Apply for JTA", link: "../../client/html/JTA.html" },
  { name: "Logout", link: "../../client/html/login.html" },
  // { name: "Apply for JTA", link: "html/JTA.html" },
  // { name: "Logout", link: "html/login.html" },
];

dropdownItems.forEach((item) => {
  const aElement = document.createElement("a");
  aElement.href = item.link;
  aElement.textContent = item.name;
  if (item.name == "Logout" && userName === null) {
    aElement.textContent = "login";
  }
  if (item.name === "Logout") {
    aElement.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = clientLoginURL;
      localStorage.clear();
    });
  } else if (item.name === "Profile" || item.name === "Apply for JTA") {
    if (userName === null) {
      aElement.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = clientLoginURL;
      });
    }
  }
  if (isAdmin && item.name === "Apply for JTA") {
    aElement.href = "../../client/html/JTARequests.html";

    aElement.textContent = "JTA requests";
  }

  avatarDropdown.appendChild(aElement);
});
avatarDropdown.style.display = "none";
avatar.appendChild(avatarDropdown);

avatar.addEventListener("click", () => {
  if (avatarDropdown.style.display === "none") {
    avatarDropdown.style.display = "block";
  }
  avatarDropdown.classList.toggle("show");
});

// Create burger menu
const burgerMenuDiv = document.createElement("div");
burgerMenuDiv.classList.add("burger-menu");
const spanTop = document.createElement("span");
spanTop.classList.add("top");
const spanMid = document.createElement("span");
spanMid.classList.add("mid");
const spanBtm = document.createElement("span");
spanBtm.classList.add("btm");
burgerMenuDiv.appendChild(spanTop);
burgerMenuDiv.appendChild(spanMid);
burgerMenuDiv.appendChild(spanBtm);
containerDiv.appendChild(burgerMenuDiv);
// Create mobile navigation
const mobileNavDiv = document.createElement("div");
mobileNavDiv.classList.add("mobile-nav");

let mobileNavLinks;
mobileNavLinks = [
  { href: ".././../client/index.html", iconUnicode: "\u{f015}" },
  { href: "../../client/html/location.html", iconUnicode: "\u{f3c5}" },
  { href: "../../client/html/TA-directory.html", iconUnicode: "\u{f5fc}" },
  { href: "../../client/html/selectCourse.html", iconUnicode: "\u{f5da}" },
];
mobileNavLinks.forEach((link) => {
  const aElement = document.createElement("a");
  aElement.href = link.href;
  const iElement = document.createElement("i");
  iElement.classList.add("fa-solid");
  iElement.textContent = link.iconUnicode;
  aElement.appendChild(iElement);
  mobileNavDiv.appendChild(aElement);
});

containerDiv.appendChild(mobileNavDiv);

// Append the container to the header
header.appendChild(containerDiv);

// Hamburger menu functionality
let hamburgerMenu = document.querySelector(".burger-menu");
let navBar = document.querySelector(".nav");
hamburgerMenu.addEventListener("click", () => {
  let vis = navBar.getAttribute("data-visibility");
  if (vis === "false") {
    navBar.setAttribute("data-visibility", "true");
    hamburgerMenu.classList.add("active");
  } else {
    navBar.setAttribute("data-visibility", "false");
    hamburgerMenu.classList.remove("active");
  }
});
import { clientLoginURL } from "../utils/env.js";

const semester = localStorage.getItem("semester");
const isVerified = localStorage.getItem("isVerified");
if (semester && !isVerified) {
  window.location.href = clientLoginURL;
}

if (location.pathname === "/client/html/JTARequests.html" && !isAdmin) {
  // prevent data from being displayed
  window.location.href = clientLoginURL;
}
