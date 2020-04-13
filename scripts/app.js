const topResult = document.querySelector("#top-result");
const bottomResult = document.querySelector("#bottom-result");
const container = document.querySelector("#container");
const operators = document.querySelectorAll(".operators");
const numbers = document.querySelectorAll(".numbers");
const equals = document.querySelector("#equal");
const btnAC = document.querySelector("#btn-ac");
const btnBack = document.querySelector("#btn-back");
const dot = document.querySelector("#dot");
const buttons = document.querySelectorAll(".buttons");
topResult.fontSize = "60px";
let size = topResult.fontSize.replace("px", "");
let dotUsed = false;
let equalsUsed = false;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const audio = document.querySelector("#keypressSound");
    // audio.currenTime = 0;
    audio.volume = 0.1;
    audio.load();
    audio.play();
  });
});

numbers.forEach((number) => {
  number.addEventListener("click", (e) => {
    if (equalsUsed === true) {
      equalsReset();
      topResult.textContent = "";
    }
    if (topResult.textContent.length < 25) {
      // Decrease font size as we get to the border of the screen
      if (topResult.clientWidth + 10 > container.clientWidth && size >= 20) {
        // size -= 5;
        // topResult.style.fontSize = size.toString() + "px";
      }
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

  topResult.textContent = topResult.textContent.slice(0, -1);
  // Create a new span element
  topResult.insertAdjacentHTML(
    "beforeend",
    `<span class="numbers vanishIn">${lastChar}</span>`
  );
  setTimeout(() => {
    backSpace();
  }, 350);
});

btnAC.addEventListener("click", () => {
  topResult.classList.add("vanishOut");
  bottomResult.classList.add("vanishOut");
  setTimeout(() => {
    topResult.textContent = "";
    bottomResult.textContent = "";
    topResult.classList.remove("vanishOut");
    bottomResult.classList.remove("vanishOut");
  }, 900);
});

operators.forEach((operator) => {
  operator.addEventListener("click", (e) => {
    dotUsed = false;
    operatorConcat(e.target.innerText);
  });
});

dot.addEventListener("click", (e) => {
  if (
    dotUsed === false &&
    !isNaN(topResult.textContent[topResult.textContent.length - 1])
  ) {
    topResult.textContent += e.target.innerText;
    dotUsed = true;
  }
});

// For disallowing multiple operators to be added concurrently
function operatorConcat(operator) {
  // Convert to array
  const topResultString = [...topResult.textContent];
  // If the last character is a symbol, then replace it with the symbol that is clicked on
  if (isNaN(topResult.textContent[topResult.textContent.length - 1])) {
    topResultString[topResultString.length - 1] = operator;
    topResult.textContent = topResultString.join("");
  } else {
    topResult.textContent += operator;
  }

  if (equalsUsed === true) {
    topResult.textContent = bottomResult.textContent;
    bottomResult.textContent = "";
    equalsReset();
    topResult.textContent += operator;
  }
}

function operate() {
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
  topResult.textContent = topResult.textContent.slice(0, -1);

  if (topResult.clientWidth + 10 < container.clientWidth && size < 60) {
    size += 5;
    topResult.style.fontSize = size.toString() + "px";
  }
  if (equalsUsed === true) {
    operate();
    bottomResult.textContent = "";
    equalsReset();
  }
  operate();
}

function equalsReset() {
  if (equalsUsed === true) {
    topResult.classList.remove("scale-down");
    bottomResult.classList.remove("scale-up");
    equalsUsed = false;
  }
}
