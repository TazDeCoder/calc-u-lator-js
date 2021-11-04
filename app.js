"use strict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

// Labels
const labelDisplay = document.querySelector(".label--display");
// Buttons
const btnPlus = document.querySelector(".keypad__btn--plus");
const btnMinus = document.querySelector(".keypad__btn--minus");
const btnTimes = document.querySelector(".keypad__btn--times");
const btnDivide = document.querySelector(".keypad__btn--divide");
const btnClear = document.querySelector(".keypad__btn--clear");
const btnEquals = document.querySelector(".keypad__btn--equals");
// Parents
const keypadDock = document.querySelector(".keypad--dock");
const keypadAside = document.querySelector(".keypad--aside");

////////////////////////////////////////////////
////// Global variables
///////////////////////////////////////////////

let currNum, currOper;

// Object that performs math calculations
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
  currOper = "";
  currNum = 0;
  // Clean-up UI
  labelDisplay.textContent = "0";
  deactivateOperators();
}

////////////////////////////////////////////////
////// App UI Setup
///////////////////////////////////////////////

const updateDisplay = (str) => (labelDisplay.textContent = str);

function deactivateOperators() {
  const [...btns] = keypadAside.querySelectorAll(".keypad__btn");
  btns.forEach((btn) => btn.classList.remove("keypad__btn--active"));
}

function keypadTriggered() {
  let val;
  const displayStr = labelDisplay.textContent;
  if (displayStr === "0") val = this;
  else if (
    !(displayStr.includes(".") && this === ".") &&
    displayStr.length <= 13
    // Prevents > 1 decimal occurance in input string
    // and labelDisplay exceeding > 13 chars
  )
    val = displayStr.concat(this);
  updateDisplay(val);
  deactivateOperators();
}

function operatorTriggered() {
  currOper = this;
  if (currNum && !btnEquals.classList.contains("keypad__btn--active"))
    calcNumbers(currOper.value);
  else currNum = +labelDisplay.textContent;

  deactivateOperators();
  this.classList.add("keypad__btn--active");
  updateDisplay("0");
}

function displayCalc() {
  if (currNum) {
    calcNumbers(currOper.value);
    deactivateOperators();
    btnEquals.blur();
    btnEquals.classList.add("keypad__btn--active");
    updateDisplay(currNum);
  }
}

////////////////////////////////////////////////
////// App Logic
///////////////////////////////////////////////

function calcNumbers(oper) {
  const tempNum = +labelDisplay.textContent;
  switch (oper) {
    case "+":
      currNum = calculator.add(currNum, tempNum);
      break;
    case "-":
      currNum = calculator.subtract(currNum, tempNum);
      break;
    case "*":
      currNum = calculator.multiply(currNum, tempNum);
      break;
    case "/":
      currNum = calculator.divide(currNum, tempNum);
      break;
  }
}

////////////////////////////////////////////////
////// Event Handlers
///////////////////////////////////////////////

function tapCallBack(e) {
  const clicked = e.target;
  if (!clicked) return;
  clicked.blur();
  if (clicked.classList.contains("keypad__btn"))
    clicked.classList.toggle("keypad__btn--active");
}

// Emulates visual tap feedback
keypadDock.addEventListener("mousedown", tapCallBack);
keypadDock.addEventListener("mouseup", tapCallBack);

keypadDock.addEventListener("click", function (e) {
  const clicked = e.target;
  if (!clicked) return;
  if (
    clicked.classList.contains("keypad__btn") &&
    !clicked.classList.contains("keypad__btn--clear")
  )
    keypadTriggered.call(clicked.value);
});

keypadAside.addEventListener("click", function (e) {
  const clicked = e.target;
  if (!clicked) return;
  if (
    clicked.classList.contains("keypad__btn") &&
    !clicked.classList.contains("keypad__btn--equals")
  )
    operatorTriggered.call(clicked);
});

btnClear.addEventListener("click", init);
btnEquals.addEventListener("click", displayCalc);

// --- KEYBOARD SUPPORT ---

document.addEventListener("keyup", function (e) {
  const pressed = e.key;
  if (!pressed) return;
  // Number keyboard input [0 - 9]
  if (pressed.match(/\d/g)) return keypadTriggered.call(pressed);
  // Keyboard input use cases
  switch (pressed) {
    case "Backspace":
      return updateDisplay(labelDisplay.textContent.slice(0, -1));
    case "Enter":
      return displayCalc();
    case "=":
      return displayCalc();
    case "+":
      return operatorTriggered.call(btnPlus);
    case "-":
      return operatorTriggered.call(btnMinus);
    case "*":
      return operatorTriggered.call(btnTimes);
    case "/":
      return operatorTriggered.call(btnDivide);
    case ".":
      return keypadTriggered.call(pressed);
    case "Escape":
      return init();
  }
});
