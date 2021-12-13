"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
const keypadDock = document.querySelector(".keypad__item--dock");
const keypadAside = document.querySelector(".keypad__item--aside");
const asideHistory = document.querySelector(".aside__content--history");
// Labels
const labelDisplay = document.querySelector(".keypad__label--display");
// Buttons
const btnPlus = document.querySelector(".item__btn--plus");
const btnMinus = document.querySelector(".item__btn--minus");
const btnTimes = document.querySelector(".item__btn--times");
const btnDivide = document.querySelector(".item__btn--divide");
const btnEquals = document.querySelector(".item__btn--equals");
const btnClearCalc = document.querySelector(".item__btn--clear");
const btnClearHist = document.querySelector(".aside__btn--clear");

////////////////////////////////////////////////
////// Public API Modules
///////////////////////////////////////////////

// Module that performs mathematical calculations
const calculator = (function module() {
  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;
  const multiply = (a, b) => a * b;
  const divide = (a, b) => a / b;

  var publicAPI = {
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
  #currNum;
  #currOper;

  constructor() {
    this._loadApp();
    // Add event handlers
    document.addEventListener("keyup", this._handleKeyupPress.bind(this));
    keypadDock.addEventListener("mousedown", this._handleDockEvents);
    keypadDock.addEventListener("mouseup", this._handleDockEvents);
    keypadDock.addEventListener("click", this._handleDockEvents.bind(this));
    keypadAside.addEventListener("click", this._handleAsideEvents.bind(this));
    btnEquals.addEventListener("click", this._displayCalc.bind(this));
    btnClearCalc.addEventListener("click", this._clearCalc.bind(this));
    btnClearHist.addEventListener("click", this._clearHist);
  }

  _loadApp() {
    this._clearCalc();
    this._clearHist();
  }

  _updateDisplay(str) {
    if (str) labelDisplay.textContent = str;
  }

  _displayCalc() {
    if (this.#currNum) {
      const [num1, num2] = this._calcNumbers(this.#currOper.value);
      this._deactivateOpers();
      btnEquals.blur();
      btnEquals.classList.add("btn--active");
      this._updateDisplay(this.#currNum);
      this._updateHist(num1, num2, this.#currNum);
    }
  }

  _clearCalc() {
    this.#currOper = "";
    this.#currNum = 0;
    labelDisplay.textContent = "0";
    this._deactivateOpers();
  }

  _clearHist() {
    if (!asideHistory.firstChild) return;
    while (asideHistory.firstChild)
      asideHistory.removeChild(asideHistory.firstChild);
  }

  _updateHist(num1, num2, num3) {
    const p = document.createElement("p");
    p.textContent = `${num1} ${this.#currOper.value} ${num2} = ${num3}`;
    p.classList.add("content__label");
    asideHistory.appendChild(p);
  }

  _calcNumbers(oper) {
    var tempNum = +labelDisplay.textContent;
    switch (oper) {
      case "+":
        this.#currNum = calculator.add(this.#currNum, tempNum);
        break;
      case "-":
        this.#currNum = calculator.subtract(this.#currNum, tempNum);
        break;
      case "*":
        this.#currNum = calculator.multiply(this.#currNum, tempNum);
        break;
      case "/":
        this.#currNum = calculator.divide(this.#currNum, tempNum);
        break;
    }
    return [this.#currNum, tempNum];
  }

  _keypadTriggered(keypad) {
    if (btnEquals.classList.contains("btn--active")) return;
    this._deactivateOpers();
    const keypadVal = keypad?.value ?? keypad;
    const displayStr = labelDisplay.textContent;
    if (displayStr === "0") return this._updateDisplay(keypadVal);
    if (
      // Prevents > 1 decimal occurance in input string
      // and labelDisplay exceeding > 13 chars
      !(displayStr.includes(".") && keypadVal === ".") &&
      displayStr.length <= 13
    )
      this._updateDisplay(displayStr.concat(keypadVal));
  }

  _deactivateOpers() {
    const [...btns] = keypadAside.querySelectorAll(".item__btn");
    btns.forEach((btn) => btn.classList.remove("btn--active"));
  }

  _operTriggered(oper) {
    this.#currOper = oper;
    if (this.#currNum && !btnEquals.classList.contains("btn--active"))
      this._calcNumbers(this.#currOper.value);
    else this.#currNum = +labelDisplay.textContent;

    oper.classList.add("btn--active");
    this._deactivateOpers();
    this._updateDisplay("0");
  }

  _handleDockEvents(e) {
    const clicked = e.target;
    if (!clicked) return;

    if (e.type === "mousedown" || e.type === "mouseup") {
      clicked.blur();
      if (clicked.classList.contains("item__btn"))
        clicked.classList.toggle("btn--active");
    }
    if (e.type === "click") {
      const clicked = e.target;
      if (!clicked) return;
      if (
        clicked.classList.contains("item__btn") &&
        !clicked.classList.contains("item__btn--clear")
      )
        this._keypadTriggered.call(this, clicked);
    }
  }

  _handleAsideEvents(e) {
    const clicked = e.target;
    if (!clicked) return;
    if (
      clicked.classList.contains("item__btn") &&
      !clicked.classList.contains("item__btn--equals")
    )
      this._operTriggered.call(this, clicked);
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
      case "=":
        return this._displayCalc();
      case "+":
        return this._operTriggered.call(this, btnPlus);
      case "-":
        return this._operTriggered.call(this, btnMinus);
      case "*":
        return this._operTriggered.call(this, btnTimes);
      case "/":
        return this._operTriggered.call(this, btnDivide);
      case ".":
        return this._keypadTriggered.call(this, key);
      case "Escape":
        return this._clearCalc();
    }
  }
}

const app = new App();
