const inputs = document.querySelectorAll(".input");
const topResult = document.querySelector("#top-result");
const bottomResult = document.querySelector("#bottom-result");
const container = document.querySelector("#container");
const operators = document.querySelectorAll(".operators");
topResult.fontSize = "45px";
// bottomResult.fontSize = "12px";
let size = topResult.fontSize.replace("px", "");
let dotUsed = false;
let equalsUsed = false;

inputs.forEach((input) => {
  input.addEventListener("click", (e) => {
    if (equalsUsed === true) {
      topResult.textContent = "";
      topResult.textContent = "";
      topResult.style.fontSize = "45px";
      bottomResult.style.alignSelf = "end";
      bottomResult.style.fontSize = "16px";
      equalsUsed = false;
    }
    // Only 45 characters allowed
    if (topResult.textContent.length < 45) {
      // Decrease font size as we get to the border of the screen
      if (topResult.clientWidth + 10 > container.clientWidth && size >= 20) {
        size -= 5;
        topResult.style.fontSize = size.toString() + "px";
      }
      topResult.textContent += e.target.innerText;
    }
    operate();
  });
});

operators.forEach((operator) => {
  operator.addEventListener("click", (e) => {
    const operatorChar = e.target.innerText;

    if (equalsUsed === true) {
      topResult.textContent = bottomResult.textContent;
      bottomResult.textContent = "";
      topResult.style.fontSize = "45px";
      bottomResult.style.alignSelf = "end";
      bottomResult.style.fontSize = "16px";
      equalsUsed = false;
    }

    // CONVERT TO SWITCH CASE
    if (operatorChar === "+") {
      operatorConcat(operatorChar);
    }
    if (operatorChar === "-") {
      operatorConcat(operatorChar);
    }
    if (operatorChar === "×") {
      operatorConcat(operatorChar);
    }
    if (operatorChar === "÷") {
      operatorConcat(operatorChar);
    }
    if (operatorChar === "%") {
      operatorConcat(operatorChar);
    }
    if (operatorChar === "=") {
      bottomResult.style.fontSize = "40px";
      bottomResult.style.alignSelf = "baseline";
      topResult.style.fontSize = "16px";
      equalsUsed = true;
    }
    if (operatorChar === "." && dotUsed === false) {
      operatorConcat(operatorChar);
      dotUsed = true;
    }
    if (operatorChar === "«") {
      topResult.textContent = topResult.textContent.slice(0, -1);
      operate();
    }
    if (operatorChar === "AC") {
      topResult.textContent = "";
      bottomResult.textContent = "";
    }
  });
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
}
function operate() {
  console.log(topResult.textContent);

  const expression = topResult.textContent
    .replace(/÷/g, "/")
    .replace(/×/g, "*");
  // For backspace errors, since we don't want to evaluate with an operation at the end
  if (!isNaN(topResult.textContent[topResult.textContent.length - 1])) {
    bottomResult.textContent = math.evaluate(expression);
  }
  console.log(expression);
}
