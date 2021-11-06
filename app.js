"use strict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

// Labels
const labelDisplay = document.querySelector(".keypad__label--display");
// Buttons
const btnPlus = document.querySelector(".keypad__btn--plus");
const btnMinus = document.querySelector(".keypad__btn--minus");
const btnTimes = document.querySelector(".keypad__btn--times");
const btnDivide = document.querySelector(".keypad__btn--divide");
const btnEquals = document.querySelector(".keypad__btn--equals");
const btnClearCalc = document.querySelector(".keypad__btn--clear");
const btnClearHist = document.querySelector(".aside__btn--clear");
// Parents
const keypadDock = document.querySelector(".keypad--dock");
const keypadAside = document.querySelector(".keypad--aside");
const asideHistory = document.querySelector(".aside--history");

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
  clearCalc();
  clearHist();
}

////////////////////////////////////////////////
////// App UI Setup
///////////////////////////////////////////////

const updateDisplay = (str) => (labelDisplay.textContent = str);

function deactivateOpers() {
  const [...btns] = keypadAside.querySelectorAll(".keypad__btn");
  btns.forEach((btn) => btn.classList.remove("keypad__btn--active"));
}

function clearCalc() {
  currOper = "";
  currNum = 0;
  labelDisplay.textContent = "0";
  deactivateOpers();
}

function clearHist() {
  if (!asideHistory.firstChild) return;
  while (asideHistory.firstChild)
    asideHistory.removeChild(asideHistory.firstChild);
}

function keypadTriggered() {
  if (btnEquals.classList.contains("keypad__btn--active")) return;
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
  deactivateOpers();
}

function operTriggered() {
  currOper = this;
  if (currNum && !btnEquals.classList.contains("keypad__btn--active"))
    calcNumbers(currOper.value);
  else currNum = +labelDisplay.textContent;

  deactivateOpers();
  this.classList.add("keypad__btn--active");
  updateDisplay("0");
}

function displayCalc() {
  if (currNum) {
    const [num1, num2] = calcNumbers(currOper.value);
    deactivateOpers();
    btnEquals.blur();
    btnEquals.classList.add("keypad__btn--active");
    updateDisplay(currNum);
    updateHist(num1, num2, currNum);
  }
}

function updateHist(num1, num2, num3) {
  const p = document.createElement("p");
  p.textContent = `${num1} ${currOper.value} ${num2} = ${num3}`;
  p.classList.add("aside__line");
  asideHistory.appendChild(p);
}

////////////////////////////////////////////////
////// App Logic
///////////////////////////////////////////////

function calcNumbers(oper) {
  const tempNum = +labelDisplay.textContent;
  const numArr = [currNum, tempNum];
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
  return numArr;
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
    operTriggered.call(clicked);
});

btnEquals.addEventListener("click", displayCalc);
btnClearCalc.addEventListener("click", clearCalc);
btnClearHist.addEventListener("click", clearHist);

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
      return operTriggered.call(btnPlus);
    case "-":
      return operTriggered.call(btnMinus);
    case "*":
      return operTriggered.call(btnTimes);
    case "/":
      return operTriggered.call(btnDivide);
    case ".":
      return keypadTriggered.call(pressed);
    case "Escape":
      return clearCalc();
  }
});
