"use strict";

import "core-js/stable";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
const keypadDock = document.querySelector(".keypad__item--dock");
const keypadAside = document.querySelector(".keypad__item--aside");
const asideHistory = document.querySelector(".aside__content--history");
// Buttons
const btnPlus = document.querySelector(".item__btn--plus");
const btnMinus = document.querySelector(".item__btn--minus");
const btnTimes = document.querySelector(".item__btn--times");
const btnDivide = document.querySelector(".item__btn--divide");
const btnEquals = document.querySelector(".item__btn--equals");
const btnClearHist = document.querySelector(".aside__btn--clear");
// Labels
const labelDisplay = document.querySelector(".keypad__label--display");

////////////////////////////////////////////////
////// Public API Modules
///////////////////////////////////////////////

// Module that performs simple mathematical calculations
const calculator = (function module() {
  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;
  const multiply = (a, b) => a * b;
  const divide = (a, b) => a / b;

  const publicAPI = {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
  };

  return publicAPI;
})();

////////////////////////////////////////////////
////// App Architecture
///////////////////////////////////////////////

class App {
  #currNumber;
  #currOperator;

  constructor() {
    // Add event handlers
    document.addEventListener("keyup", this._handleKeyupPress.bind(this));
    keypadDock.addEventListener("click", this._handleDockEvents.bind(this));
    keypadAside.addEventListener("click", this._handleAsideEvents.bind(this));
    btnClearHist.addEventListener("click", this._clearHist);
  }

  /////////////////////////////////////
  //////////// Helper functions

  _updateDisplay(str) {
    labelDisplay.textContent = str;
  }

  _deactivateBtns(btns) {
    btns.forEach((btn) => btn.classList.remove("btn--active"));
  }

  _clearHist() {
    const labels = asideHistory.querySelectorAll(".content__label");
    labels.forEach((label) => label.classList.add("hidden"));
    setTimeout(function () {
      asideHistory.innerHTML = "";
    }, 1000);
  }

  /////////////////////////////////////
  //////////// Handler functions

  _handleDockEvents(e) {
    const clicked = e.target.closest(".item__btn");
    if (!clicked) return;
    // Number keypad triggered
    if (!clicked.classList.contains("item__btn--clear"))
      return this._keypadTriggered.call(this, clicked);
    // Clear keypad triggered
    this.#currOperator = "";
    this.#currNumber = 0;
    const [...btns] = keypadAside.querySelectorAll(".item__btn");
    this._deactivateBtns(btns);
    this._updateDisplay("0");
  }

  _handleAsideEvents(e) {
    const clicked = e.target.closest(".item__btn");
    if (!clicked) return;
    // Operator keypad triggered
    if (!clicked.classList.contains("item__btn--equals"))
      return this._operatorTriggered.call(this, clicked);
    // Equals keypad triggered
    if (!this.#currNumber) return;
    const [num1, num2] = this._calcNumbers(this.#currOperator.value);
    const [...btns] = keypadAside.querySelectorAll(".item__btn");
    this._deactivateBtns(btns);
    btnEquals.blur();
    btnEquals.classList.add("btn--active");
    this._updateDisplay(this.#currNumber);
    // Updating history tab
    const html = `
      <p class="content__label label">${num1} ${
      this.#currOperator.value
    } ${num2} = ${this.#currNumber}
      </p>
    `;
    // Inserting label onto history tab
    asideHistory.insertAdjacentHTML("beforeend", html);
  }

  _handleKeyupPress(e) {
    const key = e.key;
    if (!key) return;
    // Number keyboard input [0 - 9]
    if (key.match(/\d/g)) return this._keypadTriggered.call(this, key);
    // Keyboard input use cases
    switch (key) {
      case "Backspace":
        return this._updateDisplay(labelDisplay.textContent.slice(0, -1));
      case "Enter":
        return this._displayCalc();
      case "+":
        return this._operatorTriggered.call(this, btnPlus);
      case "-":
        return this._operatorTriggered.call(this, btnMinus);
      case "*":
        return this._operatorTriggered.call(this, btnTimes);
      case "/":
        return this._operatorTriggered.call(this, btnDivide);
      case ".":
        return this._keypadTriggered.call(this, key);
    }
  }

  /////////////////////////////////////
  //////////// Logic

  _calcNumbers(op) {
    const tempNum = +labelDisplay.textContent;

    switch (op) {
      case "+":
        this.#currNumber = calculator.add(this.#currNumber, tempNum);
        break;
      case "-":
        this.#currNumber = calculator.subtract(this.#currNumber, tempNum);
        break;
      case "*":
        this.#currNumber = calculator.multiply(this.#currNumber, tempNum);
        break;
      case "/":
        this.#currNumber = calculator.divide(this.#currNumber, tempNum);
        break;
    }

    return [this.#currNumber, tempNum];
  }

  _keypadTriggered(keypad) {
    if (btnEquals.classList.contains("btn--active")) return;
    const [...btns] = keypadAside.querySelectorAll(".item__btn");
    this._deactivateBtns(btns);
    const keypadVal = keypad?.value ?? keypad;
    const displayStr = labelDisplay.textContent;

    if (displayStr === "0") return this._updateDisplay(keypadVal);

    if (
      // Prevents > 1 decimal occurance in input string
      // and label exceeding > 13 characters
      !(displayStr.includes(".") && keypadVal === ".") &&
      displayStr.length <= 13
    )
      this._updateDisplay(displayStr.concat(keypadVal));
  }

  _operatorTriggered(oper) {
    this.#currOperator = oper;

    if (this.#currNumber && !btnEquals.classList.contains("btn--active"))
      this._calcNumbers(this.#currOperator.value);
    else this.#currNumber = +labelDisplay.textContent;

    const [...btns] = keypadAside.querySelectorAll(".item__btn");
    this._deactivateBtns(btns);
    this._updateDisplay("0");
    oper.classList.add("btn--active");
  }
}

const app = new App();
