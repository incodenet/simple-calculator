document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  var firstValue, operatorValue, secondValue, calcExpr = [], equals;

  (function processOperations() {
    var keys = document.querySelectorAll(".key"),
        keyControl = document.getElementById("keys_control");

    for (var i = 0; i < keys.length; i++) {
      keys[i].addEventListener("click", function() {
        var keyPressed,
          type = this.getAttribute("data-type"),
          role = this.getAttribute("data-role"),
          symbols = this.textContent.trim(),
          parsedSymbols = parseFloat(symbols);

        if(keyControl.classList.contains("operator-exists")) {
          keyPressed = true;
        }

        switch(type) {
          case "action":
            operate(type, role, null);
            break;

          case "number":
            keyControl.classList.remove("operator-exists");
            operate(type, role, parsedSymbols);
            break;

          case "symbol":
            keyControl.classList.remove("operator-exists");
            operate(type, role, symbols);
            break;

          case "operator":
            keyControl.classList.add("operator-exists");

            if (!keyPressed) {
              operate(type, role, symbols);
            } else {
              return false;
            }
            break;

          default:
            return true;
        }
      });
    }
  })();

  (function useKeyboard() {
    document.addEventListener("keyup", function (e) {
      var keyPressed,
        keyControl = document.getElementById("keys_control");

      if (e.shiftKey && (e.keyCode === 48
          || e.keyCode === 49
          || e.keyCode === 50
          || e.keyCode === 51
          || e.keyCode === 52
          || e.keyCode === 54
          || e.keyCode === 55
          || e.keyCode === 57
          || e.keyCode === 189)
          || e.key === "=") return;

      // console.log(e.keyCode, e.key,e.code);

      if(keyControl.classList.contains("operator-exists")) {
        keyPressed = true;
      }

      switch(e.keyCode) {
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
          keyControl.classList.remove("operator-exists");
          typeNumber(e.key);
          break;

        case 48:
        case 96:
          typeNumber(e.key);
          break;

        case 187:
        case 189:
        case 106:
        case 107:
        case 109:
        case 111:
        case 191:
          keyControl.classList.add("operator-exists");

          if (!keyPressed) {
            typeOperator(e.key);
          } else {
            return false;
          }
          break;

        case 110:
          keyControl.classList.remove("operator-exists");
          typeSymbol(e.key);
          break;

        case 8:
          keyControl.classList.remove("operator-exists");
          cancel();
          break;

        case 32:
          clear();
          break;

        case 13:
          isEqual();
          break;

        default:
          return true;
      }
    });
  })();

  function operate(type, role, value){
    switch (role) {
      case "cancel":
        cancel(type);
        break;

      case "clear":
        clear(type);
        break;

      case "number":
        typeNumber(value);
        break;

      case "decimal":
        typeSymbol(value);
        break;

      case "operator":
        typeOperator(value);
        break;

      case "calculate":
        isEqual();
        break;

      default:
        return false;
    }
  }



  function typeNumber(number) {
    var resultArea = document.getElementById("result");

    resultArea.value += parseFloat(number);

    calcExpr = resultArea.value.trim().split(operatorValue);

    firstValue = parseFloat(calcExpr[0]);
    secondValue = parseFloat(calcExpr[1]);

    resultArea.style.color = "";
  }

  function typeSymbol(symbol) {
    var resultArea = document.getElementById("result"),
      existedValue = resultArea.value;

    // if(existedValue.indexOf(".") > -1) return;

    if(existedValue.trim() === "") {
      resultArea.value += 0 + symbol;
    } else {
      resultArea.value += symbol;
    }

    resultArea.style.color = "";
  }

  function typeOperator(oper) {
    var resultArea = document.getElementById("result"),
      existedValue = resultArea.value;

    if(existedValue.trim() === "") return;

    console.log(operatorValue);

    if(typeof operatorValue !== 'undefined' && (!isNaN(equals) || typeof equals === 'undefined')) {
      console.log("000000");

      var x = parseFloat(firstValue),
          y = parseFloat(secondValue),
          op = operatorValue;

      calculateExpression(x, y, op);

      resultArea.value = "";
      operatorValue = oper;

      resultArea.value += equals + oper;

      resultArea.style.color = "red";
    } else {
      console.log("111111", equals);

      resultArea.value += oper;
      operatorValue = oper;

      resultArea.style.color = "";
    }
  }

  function cancel() {
    var slicedString,
      resultArea = document.getElementById("result"),
      existedString = resultArea.value,
      slicedX, slicedY, operatorExists = true;

    slicedString = existedString.slice(0, -1);

    document.getElementById("keys_control").classList.remove("operator-exists");
    resultArea.style.color = "";

    if(existedString.indexOf('+') === existedString.length -1
      || existedString.indexOf('-') === existedString.length -1
      || existedString.indexOf('*') === existedString.length -1
      || existedString.indexOf('/') === existedString.length -1
      || existedString.indexOf('%') === existedString.length -1
    ) {
      operatorValue = 'undefined';

      operatorExists = false;
    } else {
      operatorExists = true;
    }

    if(!isNaN(calcExpr[0]) && !operatorExists) {
      equals = 'NaN';

      slicedX = calcExpr[0].slice(0, -1);
      calcExpr[0] = slicedX;
      firstValue = slicedX;
    }

    if(!isNaN(calcExpr[1]) && !isNaN(calcExpr[0])) {
      slicedY = calcExpr[1].slice(0, -1);
      calcExpr[1] = slicedY;
      secondValue = slicedY;
    }

    resultArea.value = slicedString.trim();

    if(existedString.indexOf('.') === existedString.length -1
      && existedString.indexOf('0') === 0) {
      resultArea.value = "";
    }

    if (resultArea.value.trim() === "") {
      showCalculationHistory(false);

      equals = 'NaN';
    }
  }

  function clear() {
    var resultArea = document.getElementById("result");

    resultArea.value = "";
    resultArea.style.color = "";

    equals = 'NaN';

    showCalculationHistory(false);
  }

  function isEqual() {
     var result = document.getElementById("result"),
       x = parseFloat(firstValue),
       y = parseFloat(secondValue),
       o = operatorValue;

    if(typeof o === 'undefined' || isNaN(x) || isNaN(y)) return;

    calculateExpression(x, y, o);

    result.value = equals;
    result.style.color = "red";
  }

  function calculateExpression(x, y, op) {
    var historyArea = document.querySelector(".history");

    switch (op) {
      case "+":
        historyArea.textContent = x + " + " + y;
        equals = +x + +y;
        break;
      case "-":
        historyArea.textContent = x + " - " + y;
        equals = x - y;
        break;
      case "/":
        historyArea.textContent = x + " / " + y;
        equals = x / y;
        break;
      case "*":
        historyArea.textContent = x + " * " + y;
        equals = x * y;
        break;
      case "%":
        historyArea.textContent = x + " % " + y;
        equals = x * y / 100;
        break;
      default:
        return false;
    }

    showCalculationHistory(true);

    firstValue = 'NaN';
    operatorValue = "undefined";
    secondValue = 'NaN';

    console.log(firstValue, operatorValue, secondValue, calcExpr);
  }

  function showCalculationHistory(toggle) {
    var calculateHistory = document.querySelector(".history");

    if (toggle) {
      calculateHistory.style.display = "block";
    } else {
      calculateHistory.style.display = "none";
    }
  }
}