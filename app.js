"use strict";

// Selecting elements
const calcDisplay = document.querySelector("#display--label");
// Buttons
const btnKeypads = document.querySelectorAll(".keypad");
const btnOperators = document.querySelectorAll(".operator");
const btnClear = document.querySelector("#btn--clear");
const btnEquals = document.querySelector("#btn--equals");

// Declare global variables
let displayValue, lastOperator, currentNum, lastNum, equalsFlag;

function init() {
  // Initial conditons
  displayValue = "0";
  lastOperator = "";
  currentNum = 0;
  lastNum = 0;
  equalsFlag = false;
  // Clean-up GUI
  updateDisplay(displayValue);
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
      ans = num2 !== 0 ? num1 / num2 : 0;
      if (ans === 0) alert("You Can't Divide By 0!");
      break;
  }
  return ans;
}

function updateDisplay(string) {
  // Updates calculator display
  calcDisplay.textContent = string;
}

function keypadPressEvent(value) {
  // Trigger whenever a calculator keypad is activated
  if (displayValue === "0") displayValue = value;
  else {
    if (displayValue.includes(".") && value === ".");
    else if (displayValue.length <= 13) displayValue += value;
  }
  if (lastOperator !== "") lastOperator.classList.remove("btn--active");
  updateDisplay(displayValue);
}

// Button functionalities
for (let i = 0; i < btnKeypads.length; i++) {
  btnKeypads[i].addEventListener("mousedown", function () {
    btnKeypads[i].classList.add("btn--active");
  });
  btnKeypads[i].addEventListener("mouseup", function () {
    btnKeypads[i].classList.remove("btn--active");
  });
  btnKeypads[i].addEventListener("click", function () {
    keypadPressEvent(btnKeypads[i].btnKeypads[i].value);
  });
}

for (let i = 0; i < btnOperators.length; i++) {
  btnOperators[i].addEventListener("click", function () {
    btnOperators[i].classList.add("btn--active");
  });
  btnOperators[i].addEventListener("click", function () {
    if (currentNum !== 0 && !equalsFlag) {
      lastNum = Number(displayValue);
      currentNum = operate(lastOperator.textContent, currentNum, lastNum);
    } else {
      currentNum = Number(displayValue);
      lastNum = 0;
      equalsFlag = false;
    }
    lastOperator = btnOperators[i];
    // Reset calculator display value
    displayValue = "0";
    updateDisplay(displayValue);
  });
}

btnClear.addEventListener("click", function () {
  init();
});

btnEquals.addEventListener("click", function () {
  displayValue = calcDisplay.textContent;
  if ((currentNum === Number(displayValue) && equalsFlag) || currentNum !== 0) {
    if (!equalsFlag) {
      lastNum = Number(displayValue);
      currentNum = operate(lastOperator.textContent, currentNum, lastNum);
    }
    lastNum = 0;
    equalsFlag = true;
    displayValue = String(currentNum);
    lastOperator.classList.remove("btn--active");
    updateDisplay(displayValue);
  }
});

// Keyboard events
document.addEventListener("keydown", function (e) {
  if (e.key === "Backspace") {
    displayValue = displayValue.slice(0, -1);
    updateDisplay(displayValue);
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key.match(/\d/g)) keypadPressEvent(e.key);
});

// Main code execution
init();
