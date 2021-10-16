"use strict";

// Selecting elements
const displayLbl = document.querySelector("#display--label");
// Buttons
const btnClear = document.querySelector("#btn--clear");
const btnEquals = document.querySelector("#btn--equals");
// --- KEYPADS ---
const btnKeypads = document
  .querySelector("#btn--dock")
  .getElementsByClassName("keypad");
const keypadValues = Object.values(btnKeypads);
// --- OPERATORS ---
const btnOperators = document
  .querySelector("#btn--aside")
  .getElementsByClassName("operator");
const operatorValues = Object.values(btnOperators);
const [plusOperator, minusOperator, timesOperator, divideOperator] =
  btnOperators;

// Initialise variables
let displayStr, currOperator, currNum, tempNum, equalsFlag;

// Object that performs all of our calculations
const calculator = {
  add(num1, num2) {
    return num1 + num2;
  },
  subtract(num1, num2) {
    return num1 - num2;
  },
  multiply(num1, num2) {
    return num1 * num2;
  },
  divide(num1, num2) {
    return num1 / num2;
  },
};

(() => init())();

function init() {
  // Reset conditons
  currOperator = "";
  currNum = 0;
  tempNum = 0;
  equalsFlag = false;
  // Clean-up GUI
  if (currOperator) deactivateOperator();
  resetDisplay();
}

// App GUI functions
function resetDisplay() {
  displayStr = "0";
  updateDisplay();
}

function updateDisplay() {
  displayLbl.textContent = displayStr;
}

function deactivateOperator() {
  currOperator.classList.remove("btn--active");
}

function keypadTriggered(val) {
  if (!equalsFlag) {
    if (displayStr === "0") displayStr = val;
    else {
      // Prevents > 1 decimal occurance in input string
      // and displayLbl exceeding > 13 chars
      if (!(displayStr.includes(".") && val === ".") && displayStr.length <= 13)
        displayStr += val;
    }
    if (currOperator) deactivateOperator();
    updateDisplay();
  }
}

function displayCalc() {
  displayStr = displayLbl.textContent;
  if (currNum) {
    if (!equalsFlag) calcNumbers();
    tempNum = 0;
    equalsFlag = true;
    displayStr = String(currNum);
    deactivateOperator();
    updateDisplay();
  }
}

// App logic functions
function calcNumbers() {
  tempNum = Number(displayStr);
  switch (currOperator.value) {
    case "+":
      return (currNum = calculator.add(currNum, tempNum));
    case "-":
      return (currNum = calculator.subtract(currNum, tempNum));
    case "*":
      return (currNum = calculator.multiply(currNum, tempNum));
    case "/":
      return (currNum = calculator.divide(currNum, tempNum));
  }
}

function operatorTriggered(operator) {
  if (operator !== currOperator && currOperator) deactivateOperator();
  currOperator = operator;
  currOperator.classList.add("btn--active");
  if (currNum && !equalsFlag) calcNumbers();
  else {
    currNum = Number(displayStr);
    tempNum = 0;
    equalsFlag = false;
  }
}

// Button functionalities
btnClear.addEventListener("click", init);
btnEquals.addEventListener("click", displayCalc);

keypadValues.forEach(function (keypad) {
  // Registers keypad
  keypad.addEventListener("click", function () {
    keypadTriggered(keypad.value);
  });
  // Emulates visual tap event
  keypad.addEventListener("mousedown", function () {
    keypad.classList.add("btn--active");
  });
  keypad.addEventListener("mouseup", function () {
    keypad.classList.remove("btn--active");
  });
});

operatorValues.forEach(function (operator) {
  operator.addEventListener("click", function () {
    operatorTriggered(operator);
    resetDisplay();
  });
});

// --- KEYBOARD SUPPORT
document.addEventListener("keyup", function (e) {
  // Number keyboard input [0 - 9]
  if (e.key.match(/\d/g)) return keypadTriggered(e.key);
  // General keyboard input use case
  switch (e.key.toLowerCase()) {
    case "escape":
      return init();
    case "backspace":
      displayStr.splice(0, -1);
      return updateDisplay();
    case "enter":
      return displayCalc();
    case "+":
      operatorTriggered(plusOperator);
      break;
    case "-":
      operatorTriggered(minusOperator);
      break;
    case "*":
      operatorTriggered(timesOperator);
      break;
    case "/":
      operatorTriggered(divideOperator);
      break;
    default:
      return null;
  }
  resetDisplay();
});
