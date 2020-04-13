// DOM Selectors
const topResult = document.querySelector("#top-result");
const bottomResult = document.querySelector("#bottom-result");
const operators = document.querySelectorAll(".operators");
const numbers = document.querySelectorAll(".numbers");
const equals = document.querySelector("#equal");
const btnAC = document.querySelector("#btn-ac");
const btnBack = document.querySelector("#btn-back");
const dot = document.querySelector("#dot");
const buttons = document.querySelectorAll(".buttons");

let dotUsed = false;
let equalsUsed = false;

/*
 * -------------------------------
 * |        Functions            |
 * -------------------------------
 * */

// Scale results to their original state
function equalsReset() {
  if (equalsUsed === true) {
    topResult.classList.remove("scale-down");
    bottomResult.classList.remove("scale-up");
    equalsUsed = false;
  }
}
// For disallowing multiple operators to be added concurrently
function operatorConcat(operator) {
  // Convert to array
  const topResultString = [...topResult.textContent];
  // If the last character is a operator, then replace it with the operator that is clicked on
  if (isNaN(topResult.textContent[topResult.textContent.length - 1])) {
    topResultString[topResultString.length - 1] = operator;
    topResult.textContent = topResultString.join("");
  } else {
    topResult.textContent += operator;
  }
  // After equals has been pressed, continue operations on the bottom result, which will be transferred to the top
  if (equalsUsed === true) {
    topResult.textContent = bottomResult.textContent;
    bottomResult.textContent = "";
    equalsReset();
    topResult.textContent += operator;
  }
}

// Use Math.js to evaluate the string, possible security risks involved with this method
function operate() {
  // Replace operation symbols so the math.evaluate function can understand them
  const expression = topResult.textContent
    .replace(/÷/g, "/")
    .replace(/×/g, "*");

  // For backspace errors, since we don't want to evaluate with an operation at the end
  if (!isNaN(topResult.textContent[topResult.textContent.length - 1])) {
    const result = math.evaluate(expression);
    // Keep the bottom result hidden when there is no operator included in the topResult
    if (!isNaN(topResult.textContent)) {
      bottomResult.textContent = "";
    } else {
      bottomResult.textContent = math.round(result, 3);
    }
  }
}

function backSpace() {
  // Erase the span element
  topResult.removeChild(document.querySelector("span"));
  // topResult.textContent = topResult.textContent.slice(0, -1); -> Alternative
  if (equalsUsed === true) {
    operate();
    bottomResult.textContent = "";
    equalsReset();
  }
  operate();
}

/*
 * -------------------------------
 * |        Event Listeners      |
 * -------------------------------
 * */

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const audio = document.querySelector("#keypressSound");
    audio.volume = 0.1;
    audio.load(); // Stop audio when clicked repeatedly
    audio.play();
  });
});

numbers.forEach((number) => {
  number.addEventListener("click", (e) => {
    // If equals has been used, then reset the screen on the next number input
    if (equalsUsed === true) {
      equalsReset();
      topResult.textContent = "";
    }
    // Allow only 20 digits to be input
    if (topResult.textContent.length < 20) {
      topResult.textContent += e.target.innerText;
    }
    operate();
  });
});
equals.addEventListener("click", () => {
  if (equalsUsed === false && bottomResult.textContent !== "") {
    topResult.classList.add("scale-down");
    bottomResult.classList.add("scale-up");
    equalsUsed = true;
  }
});

btnBack.addEventListener("click", () => {
  // Avoid undefined when there is an empty string
  const lastChar =
    topResult.textContent !== ""
      ? topResult.textContent[topResult.textContent.length - 1]
      : "";
  // Erase the original last input that is placed inside the span element to avoid duplication
  topResult.textContent = topResult.textContent.slice(0, -1);
  // Create a new span element that includes the last input
  topResult.insertAdjacentHTML(
    "beforeend",
    `<span class="numbers vanishIn">${lastChar}</span>`
  );
  // Erase the span element after the vanishIn animation
  setTimeout(() => {
    backSpace();
  }, 350);
});

btnAC.addEventListener("click", () => {
  topResult.classList.add("vanishOut");
  bottomResult.classList.add("vanishOut");

  // Reset the results  after the vanishOut animations
  setTimeout(() => {
    topResult.textContent = "";
    bottomResult.textContent = "";
    topResult.classList.remove("vanishOut");
    bottomResult.classList.remove("vanishOut");
  }, 900);
});

operators.forEach((operator) => {
  operator.addEventListener("click", (e) => {
    dotUsed = false; // Reset "." to be used for the next number
    operatorConcat(e.target.innerText);
  });
});

dot.addEventListener("click", (e) => {
  // Add dot only if hasn't been used and it isn't being placed after an operator
  if (
    dotUsed === false &&
    !isNaN(topResult.textContent[topResult.textContent.length - 1])
  ) {
    topResult.textContent += e.target.innerText;
    dotUsed = true;
  }
});
