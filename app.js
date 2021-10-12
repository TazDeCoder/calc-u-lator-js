"use strict";

// Selecting elements
const displayLbl = document.querySelector("#display--label");
// Buttons
// --- KEYPADS ---
const btnKeypads = document
  .querySelector("#btn--dock")
  .getElementsByClassName("keypad");
// --- OPERATORS ---
const btnOperators = document
  .querySelector("#btn--aside")
  .getElementsByClassName("operator");
const [plusOperator, minusOperator, timesOperator, divideOperator] =
  btnOperators;
const btnClear = document.querySelector("#btn--clear");
const btnEquals = document.querySelector("#btn--equals");

// Declare global variables
let displayValue, tempNum, currentOperator, equalsFlag;

const calculator = {
  currentNum: 0,
  operate: function (operator, num1, num2) {
    switch (operator) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        const ans = num2 !== 0 ? num1 / num2 : 0;
        if (ans === 0) alert("You Can't Divide By 0!");
        return ans;
    }
  },
};

function init() {
  // Reset conditons
  calculator.currentNum = 0;
  equalsFlag = false;
  tempNum = 0;
  // Clean-up GUI
  if (currentOperator) deactivateOperator();
  currentOperator = "";
  resetDisplay();
}

const updateDisplay = (string) => (displayLbl.textContent = string);
const resetDisplay = () => {
  displayValue = "0";
  updateDisplay(displayValue);
};

const deactivateOperator = () =>
  currentOperator.classList.remove("btn--active");

function keypadTriggered(value) {
  if (displayValue === "0") displayValue = value;
  else {
    // Prevents more than one decimal occurance
    if (displayValue.includes(".") && value === ".");
    else if (displayValue.length <= 13)
      // Prevents the displayLbl exceeding 13 characters
      displayValue += value;
  }
  if (currentOperator !== "") deactivateOperator();
  updateDisplay(displayValue);
}

function operatorTriggered(operator) {
  if (operator !== currentOperator && currentOperator) deactivateOperator();
  currentOperator = operator;
  operator.classList.add("btn--active");
  if (calculator.currentNum !== 0 && !equalsFlag) {
    tempNum = Number(displayValue);
    calculator.currentNum = calculator.operate(
      currentOperator.value,
      calculator.currentNum,
      tempNum
    );
  } else {
    calculator.currentNum = Number(displayValue);
    tempNum = 0;
    equalsFlag = false;
  }
}

function displayCalculation() {
  displayValue = displayLbl.textContent;
  if (calculator.currentNum !== 0) {
    if (!equalsFlag) {
      // Continues to operate on currentNum using currentOperator
      tempNum = Number(displayValue);
      calculator.currentNum = calculator.operate(
        currentOperator.value,
        calculator.currentNum,
        tempNum
      );
    }
    tempNum = 0;
    equalsFlag = true;
    displayValue = String(calculator.currentNum);
    deactivateOperator();
    updateDisplay(displayValue);
  }
}

// Button functionalities
for (const btn of btnKeypads) {
  // Emulates visual tap event
  btn.addEventListener("mousedown", function () {
    btn.classList.add("btn--active");
  });
  btn.addEventListener("mouseup", function () {
    btn.classList.remove("btn--active");
  });
  // Registers keypad
  btn.addEventListener("click", function () {
    keypadTriggered(btn.value);
  });
}
for (const btn of btnOperators) {
  btn.addEventListener("click", function () {
    operatorTriggered(btn);
    resetDisplay();
  });
}
btnClear.addEventListener("click", init);
btnEquals.addEventListener("click", displayCalculation);

// Keyboard events
document.addEventListener("keydown", function (e) {
  // Number keyboard input
  if (e.key.match(/\d/g)) keypadTriggered(e.key);
  switch (e.key) {
    case "backspace":
      displayValue = displayValue.slice(0, -1);
      updateDisplay(displayValue);
      break;
    case "=":
      return displayCalculation();
    case "+":
      operatorTriggered(plusOperator);
      resetDisplay();
      break;
    case "-":
      operatorTriggered(minusOperator);
      resetDisplay();
      break;
    case "*":
      operatorTriggered(timesOperator);
      resetDisplay();
      break;
    case "/":
      operatorTriggered(divideOperator);
      resetDisplay();
      break;
  }
});

// Main code execution
init();
