"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Labels
const labelDisplay = document.querySelector(".keypad__label--display");
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

////////////////////////////////////////////////
////// Public API Modules
///////////////////////////////////////////////

// Module that performs simple mathematical calculations
const calculator = (() => {
  const add = (a: number, b: number) => a + b;
  const subtract = (a: number, b: number) => a - b;
  const multiply = (a: number, b: number) => a * b;
  const divide = (a: number, b: number) => a / b;

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

type operator = "+" | "-" | "*" | "/";

class App {
  currNumber: number;
  currOperator: HTMLInputElement | null;

  constructor() {
    // Add event handlers
    document.addEventListener("keyup", this._handleKeyupPress.bind(this));
    keypadDock.addEventListener("click", this._handleDockEvents.bind(this));
    keypadAside.addEventListener("click", this._handleAsideEvents.bind(this));
    btnClearHist.addEventListener("click", this._clearHist);
  }

  /////////////////////////////////////
  //////////// Helper functions

  _updateDisplay(str: string | number) {
    labelDisplay.textContent = String(str);
  }

  _deactivateBtns(btns: NodeListOf<Element>) {
    btns.forEach((btn) => btn.classList.remove("btn--active"));
  }

  _clearHist() {
    const labels = asideHistory.querySelectorAll(".content__label");
    labels.forEach((label) => label.classList.add("hidden"));
    setTimeout(() => {
      asideHistory.innerHTML = "";
    }, 1000);
  }

  /////////////////////////////////////
  //////////// Handler functions

  _handleDockEvents(e: Event) {
    const clicked = (e.target as HTMLInputElement).closest(".item__btn");
    if (!clicked) return;
    // Number keypad triggered
    if (!clicked.classList.contains("item__btn--clear"))
      return this._keypadTriggered.call(this, clicked);
    // Clear keypad triggered
    this.currOperator = null;
    this.currNumber = 0;
    const btns = keypadAside.querySelectorAll(".item__btn");
    this._deactivateBtns(btns);
    this._updateDisplay("0");
  }

  _handleAsideEvents(e: Event) {
    const clicked = (e.target as HTMLInputElement).closest(".item__btn");
    if (!clicked) return;
    // Operator keypad triggered
    if (!clicked.classList.contains("item__btn--equals"))
      return this._operatorTriggered.call(this, clicked);
    // Equals keypad triggered
    if (!this.currNumber) return;
    const num1 = +labelDisplay.textContent;
    const num2 = this.currNumber;
    const result = this._calcNumbers(this.currOperator.value as operator);
    const btns = keypadAside.querySelectorAll(".item__btn");
    this._deactivateBtns(btns);
    (btnEquals as HTMLElement).blur();
    btnEquals.classList.add("btn--active");
    this._updateDisplay(result);
    // Updating history tab
    const html = `
      <p class="content__label label">${num2} ${this.currOperator.value} ${num1} = ${result}
      </p>
    `;
    // Inserting label onto history tab
    asideHistory.insertAdjacentHTML("beforeend", html);
  }

  _handleKeyupPress(e: KeyboardEvent) {
    const key = e.key;
    if (!key) return;
    // Number keyboard input [0 - 9]
    if (key.match(/\d/g)) return this._keypadTriggered.call(this, key);
    // Keyboard input use cases
    switch (key) {
      case "Backspace":
        return this._updateDisplay(labelDisplay.textContent.slice(0, -1));
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

  _calcNumbers(operSign: operator) {
    const tempNum = +labelDisplay.textContent;

    switch (operSign) {
      case "+":
        this.currNumber = calculator.add(this.currNumber, tempNum);
        break;
      case "-":
        this.currNumber = calculator.subtract(this.currNumber, tempNum);
        break;
      case "*":
        this.currNumber = calculator.multiply(this.currNumber, tempNum);
        break;
      case "/":
        this.currNumber = calculator.divide(this.currNumber, tempNum);
        break;
    }

    return this.currNumber;
  }

  _keypadTriggered(keypad: HTMLInputElement) {
    if (btnEquals.classList.contains("btn--active")) return;
    const btns = keypadAside.querySelectorAll(".item__btn");
    this._deactivateBtns(btns);
    const keypadVal = keypad?.value;
    const displayStr = labelDisplay.textContent;

    if (displayStr === "0") return this._updateDisplay(keypadVal);

    if (
      // Prevents > 1 decimal occurance in input string
      // and label exceeding > 13 characters
      !(displayStr.match(/\./g) && keypadVal === ".") &&
      displayStr.length <= 13
    )
      this._updateDisplay(displayStr.concat(keypadVal));
  }

  _operatorTriggered(oper: HTMLInputElement) {
    this.currOperator = oper;

    if (this.currNumber && !btnEquals.classList.contains("btn--active")) {
      this._calcNumbers(this.currOperator.value as operator);
    } else {
      this.currNumber = +labelDisplay.textContent;
    }

    const btns = keypadAside.querySelectorAll(".item__btn");
    this._deactivateBtns(btns);
    this._updateDisplay("0");
    oper.classList.add("btn--active");
  }
}

const app = new App();
