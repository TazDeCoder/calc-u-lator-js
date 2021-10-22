"use strict";

// Selecting HTML elements
const labelDisplay = document.querySelector("#display--label");
// Buttons
// --- KEYPADS ---
const btnKeypads = document
  .querySelector("#btn--dock")
  .getElementsByClassName("keypad");
// --- OPERATORS ---
const btnOperators = document
  .querySelector("#btn--aside")
  .getElementsByClassName("operator");
const [btnPlus, btnMinus, btnTimes, btnDivide] = btnOperators;
// --- OTHERS ---
const btnClear = document.querySelector("#btn--clear");
const btnEquals = document.querySelector("#btn--equals");

// Initialize variables
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
  currNum = 0;
  currOper = "";
  // Clean-up GUI
  btnEquals.classList.remove("btn--active");
  if (currOper) deactivateOperator();
  updateDisplay("0");
}

// App GUI Functions
function updateDisplay(str) {
  labelDisplay.textContent = str;
}

function deactivateOperator() {
  currOper.classList.remove("btn--active");
}

function keypadTriggered(val) {
  const displayStr = labelDisplay.textContent;
  if (!btnEquals.classList.contains("btn--active")) {
    if (displayStr === "0") updateDisplay(val);
    else {
      // Prevents > 1 decimal occurance in input string
      // and displayLbl exceeding > 13 chars
      if (!(displayStr.includes(".") && val === ".") && displayStr.length <= 13)
        updateDisplay(displayStr.concat(val));
    }
    if (currOper) deactivateOperator();
  }
}

function operatorTriggered(oper) {
  const equalsClasses = btnEquals.classList;
  if (oper !== currOper && currOper) deactivateOperator();
  currOper = oper;
  currOper.classList.add("btn--active");
  if (currNum && !equalsClasses.contains("btn--active")) calcNumbers();
  else {
    currNum = Number(labelDisplay.textContent);
    equalsClasses.remove("btn--active");
  }
  updateDisplay("0");
}

function displayCalc() {
  const equalsClasses = btnEquals.classList;
  if (currNum) {
    if (!equalsClasses.contains("btn--active")) calcNumbers();
    equalsClasses.add("btn--active");
    deactivateOperator();
    updateDisplay(currNum);
  }
}

// App Logic Functions
function calcNumbers() {
  const tempNum = Number(labelDisplay.textContent);
  switch (currOper.value) {
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

// Event handlers
Object.values(btnKeypads).forEach(function (btn) {
  // Registers keypad
  btn.addEventListener("click", function () {
    keypadTriggered(btn.value);
  });
  // Emulates visual tap event
  btn.addEventListener("mousedown", function () {
    btn.classList.add("btn--active");
  });
  btn.addEventListener("mouseup", function () {
    btn.classList.remove("btn--active");
  });
});

Object.values(btnOperators).forEach(function (btn) {
  btn.addEventListener("click", function () {
    operatorTriggered(btn);
  });
});

btnClear.addEventListener("click", init);
btnEquals.addEventListener("click", displayCalc);

// --- KEYBOARD SUPPORT ---
document.addEventListener("keyup", function (e) {
  // Number keyboard input [0 - 9]
  if (e.key.match(/\d/g)) return keypadTriggered(e.key);
  // General keyboard input use case
  switch (e.key.toLowerCase()) {
    case "escape":
      return init();
    case "backspace":
      return updateDisplay(labelDisplay.textContent.slice(0, -1));
    case "enter":
      return displayCalc();
    case "+":
      return operatorTriggered(btnPlus);
    case "-":
      return operatorTriggered(btnMinus);
    case "*":
      return operatorTriggered(btnTimes);
    case "/":
      return operatorTriggered(btnDivide);
    case ".":
      return keypadTriggered(e.key);
    default:
      return;
  }
});
