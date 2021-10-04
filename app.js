"use strict";

// Selecting elements
const calcDisplay = document.querySelector("#display--label");
// Buttons
const btnKeypads = document.querySelectorAll(".keypad");
const btnOperators = document.querySelectorAll(".operator");
const btnClear = document.querySelector("#btn--clear");
const btnEquals = document.querySelector("#btn--equals");

// Declare global variables
let displayValue, currentOperator, currentNum, lastNum, equalsFlag;

function init() {
  // Initial conditons
  displayValue = "0";
  currentOperator = "";
  currentNum = 0;
  lastNum = 0;
  equalsFlag = false;
  // Clean-up GUI
  calcDisplay.textContent = displayValue;
}

function operate(operator, num1, num2) {
  let ans;
  switch (operator) {
    case "+":
      ans = num1 + num2;
      break;
    case "−":
      ans = num1 - num2;
      break;
    case "×":
      ans = num1 * num2;
      break;
    case "÷":
      ans = num1 / num2;
      break;
  }
  return ans;
}

// Button functionalities
for (let i = 0; i < btnKeypads.length; i++)
  btnKeypads[i].addEventListener("click", function () {
    if (displayValue === "0") displayValue = btnKeypads[i].textContent;
    else displayValue += btnKeypads[i].textContent;
    // Updates calculator display each time keypad pressed
    calcDisplay.textContent = displayValue;
  });

for (let i = 0; i < btnOperators.length; i++)
  btnOperators[i].addEventListener("click", function () {
    if (currentNum !== 0 && !equalsFlag) {
      lastNum = Number(displayValue)
      currentNum = operate(currentOperator, currentNum, lastNum);
    } else {
      currentNum = Number(displayValue);
      lastNum = 0;
      equalsFlag = false;
    }
    console.log(currentNum);
    console.log(lastNum);
    currentOperator = btnOperators[i].textContent;
    displayValue = "0";
    calcDisplay.textContent = displayValue;
  });

btnClear.addEventListener("click", function () {
  init();
});

btnEquals.addEventListener("click", function () {
  lastNum = Number(displayValue);
  currentNum = operate(currentOperator, currentNum, lastNum);
  lastNum = 0;
  equalsFlag = true;
  calcDisplay.textContent = currentNum;
  displayValue = currentNum;
});

// Main code execution
init();
