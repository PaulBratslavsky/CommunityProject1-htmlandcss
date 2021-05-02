/*****************************************************
  REGEX FOR FORM VALIDATION
*****************************************************/
const checkNameRegex = /^[A-Za-z ]+$/;

const checkPhoneRegex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

const checkEmailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const checkMessageRegex = /^[a-zA-Z0-9.,:;"'$&%!?_+=() \/ -]*$/;

const regex = [
  checkNameRegex,
  checkPhoneRegex,
  checkEmailRegex,
  checkMessageRegex,
];

/*****************************************************
  HELEPR FUNCTIONS
*****************************************************/
function trimWhiteSpace(value) {
  return value.replace(/^\s+/, "").replace(/\s+$/, "");
}

function removeLastItemsFromArray(items) {
  return items.splice(0, items.length - 1);
}

/*****************************************************
  SCROLL TO THE TOP FUNCTION
*****************************************************/

function backToTop(elementSelector) {
  const node = document.querySelector(elementSelector);
  node.addEventListener("click", () => window.scrollTo(0, 0));
}

/*****************************************************
  FORM VALIDATION VER 1 FUNCTION
*****************************************************/

function checkInputWithRegex(item, regex) {
  item.addEventListener("keyup", (e) => {
    const { name, value } = e.target;
    const trimmed = trimWhiteSpace(value);
    result = regex.test(trimmed) && trimmed.length > 0;

    item.style.backgroundColor = result ? "#186918" : "#822554";
    item.style.color = "white";
    item.dataset.valid = result ? "true" : "false";

    console.log(name, value, trimmed, regex, result);
  });
}

function handleFormSubmission(formId, inputValidation, regex) {
  const node = document.querySelector(formId);
  const elementsArray = Array.from(node);
  const inputItemsOnly = removeLastItemsFromArray(elementsArray);

  inputItemsOnly.forEach((item, index) => inputValidation(item, regex[index]));

  function resetForm(items) {
    items.forEach((item) => {
      console.log(item.dataset.valid);
      item.style.backgroundColor = "#363737";
      item.dataset.valid = "false";
      item.value = "";
    });
  }

  function sendData(items) {
    const dataToSend = {};
    inputItemsOnly.forEach((item) => (dataToSend[item.name] = item.value));
    console.log(dataToSend, "sending this data");
  }

  function handleSubmit(e) {
    e.preventDefault();

    let isValid = false;

    inputItemsOnly.forEach((item) => {
      console.log(item.dataset.valid);
      item.style.backgroundColor =
        item.dataset.valid == "true" ? "#186918" : "#822554";
      isValid = item.dataset.valid == "true";
    });

    if (isValid) {
      sendData(inputItemsOnly);
      resetForm(inputItemsOnly);
      alert("Great Success!");
    } else {
      alert("Complete All Requierd Fields");
    }
  }

  node.addEventListener("submit", handleSubmit);
}

/*****************************************************
  FUNCTION CALLS
*****************************************************/

backToTop("#backtothetop");
handleFormSubmission(".contact-form", checkInputWithRegex, regex);
