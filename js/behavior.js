/*****************************************************
  MOBILE NAV BEHAVIOR
*****************************************************/
function handleMobileMenuToggle(btnId, navId) {
  const toggleNavButton = document.getElementById(btnId);
  const mobileMenu = document.getElementById(navId);

  function handleToggleMenu() {
    mobileMenu.classList.toggle("show");
    toggleNavButton.classList.toggle("rotate");
  }

  toggleNavButton.addEventListener("click", handleToggleMenu);
}

/*****************************************************
  MOBILE NAV BEHAVIOR - CLOSE MENU ON CLICK
*****************************************************/
function handleCloseMenuOnClick(navId, mobileNavId, btnId) {
  const mobileMenuItems = document.getElementById(mobileNavId);
  const toggleNavButton = document.getElementById(btnId);
  const mobileMenu = document.getElementById(navId);

  function handleClick(e) {
    console.log(e.target);
    mobileMenu.classList.remove("show");
    toggleNavButton.classList.remove("rotate");
  }

  mobileMenuItems.addEventListener("click", handleClick);
}

/*****************************************************
  NAV ON SCROLL BEHAVIOR
*****************************************************/
function handleOnMenuScroll(navId) {
  const nav = document.getElementById(navId);
  // Setup isScrolling variable
  var isScrolling;
  let scrollPosition = 0;

  window.addEventListener("scroll", applyNavStyles);

  function applyNavStyles() {
    nav.classList.add("nav-active");

    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Tigger timeout on scroll end
    isScrolling = setTimeout(function () {
      nav.classList.remove("nav-active");
    }, 700);
  }
}

/*****************************************************
  REGEX FOR FORM VALIDATION
*****************************************************/
const checkNameRegex = /^[A-Za-z ]+$/;
const checkPhoneRegex =
  /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const checkEmailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const checkMessageRegex = /^[a-zA-Z0-9.,:;"'$&%!?_+=() \/ -]*$/;

const regex = [
  checkNameRegex,
  checkPhoneRegex,
  checkEmailRegex,
  checkMessageRegex,
];

/*****************************************************
  HELEPER FUNCTIONS
*****************************************************/

function removeNthItemsFromArray(items, nth) {
  return items.splice(0, items.length - nth);
}

/*****************************************************
  SCROLL TO THE TOP FUNCTION
*****************************************************/

function backToTop(elementSelector) {
  const node = document.querySelector(elementSelector);
  node.addEventListener("click", () => window.scrollTo(0, 0));
}

/*****************************************************
  LOCAL STORAGE
*****************************************************/
const tempData = {};

function populateFormData(data) {
  const node = document.querySelector(".contact-form");

  for (const [key, item] of Object.entries(data)) {
    const { value, isValid } = item;
    node[key].value = value;
    node[key].dataset.valid = isValid;
    node[key].style.backgroundColor = isValid ? "#186918" : "#822554";
  }
}

function setLocalStorage(key, value, isValid) {
  tempData[key] = { id: key, value, isValid };

  if (localStorage.getItem("localState")) {
    const current = JSON.parse(localStorage.getItem("localState"));
    const updated = { ...current, ...tempData };
    localStorage.setItem("localState", JSON.stringify(updated));
  } else {
    localStorage.setItem("localState", JSON.stringify(tempData));
  }
}

function getLocalStorage(key) {
  if (localStorage.getItem(key)) {
    const data = JSON.parse(localStorage.getItem(key));
    populateFormData(data);
  }
}

/*****************************************************
  FORM VALIDATION VER 1 FUNCTION
*****************************************************/

function checkInputWithRegex(item, regex) {
  function applyStyling(item, result) {
    item.style.backgroundColor = result ? "#186918" : "#822554";
    item.style.color = "white";
    item.dataset.valid = result ? "true" : "false";
  }

  function handleKeyUp(e) {
    const { name, value } = e.target;
    const trimmed = value.trim();
    const result = regex.test(trimmed) && trimmed.length > 0;
    applyStyling(item, result);
    setLocalStorage(name, trimmed, result);
  }

  item.addEventListener("keyup", handleKeyUp);
}

function handleFormSubmission(formId, inputValidation, regex) {
  const node = document.querySelector(formId);
  const elementsArray = Array.from(node);
  const inputItemsOnly = removeNthItemsFromArray(elementsArray, 2);
  const clearButton = document.getElementById("clearButton");

  function resetForm(items) {
    items.forEach((item) => {
      item.style.backgroundColor = "#363737";
      item.dataset.valid = "false";
      item.value = "";
    });

    localStorage.removeItem("localState");
  }

  function sendData(items) {
    const dataToSend = {};
    items.forEach((item) => (dataToSend[item.name] = item.value));
    console.log(dataToSend, "sending this data");
  }

  function findError(items) {
    return items.filter((item) => item.isValid !== true);
  }

  function handleClear(e) {
    e.preventDefault();
    resetForm(inputItemsOnly);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let isValid = [];

    inputItemsOnly.forEach((item) => {
      item.style.backgroundColor =
        item.dataset.valid == "true" ? "#186918" : "#822554";

      isValid.push({
        fieldId: item.id,
        isValid: item.dataset.valid == "true",
        value: item.value,
        label: item.dataset.label,
      });
    });

    console.log(isValid);

    if (!findError(isValid).length) {
      sendData(inputItemsOnly);
      resetForm(inputItemsOnly);
      alert("Great Success!");
    }
  }

  inputItemsOnly.forEach((item, index) => inputValidation(item, regex[index]));
  node.addEventListener("submit", handleSubmit);
  clearButton.addEventListener("click", handleClear);
}

/*****************************************************
  FUNCTION CALLS
*****************************************************/
handleOnMenuScroll("header");
handleMobileMenuToggle("toggleNavButton", "mobileMenu");
handleCloseMenuOnClick("mobileMenu", "mobile-nav", "toggleNavButton");
backToTop("#backtothetop");
handleFormSubmission(".contact-form", checkInputWithRegex, regex);
getLocalStorage("localState");
