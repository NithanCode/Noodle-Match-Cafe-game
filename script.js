const width = 8;
const board = document.getElementById("game-board");
const colors = ["1", "2", "3", "4", "5", "6", "7", "8"];
let cells = [];
const moneyTarget = 2000; // Set your desired money target

const matchesCount = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
};

function createBoard() {
  cells = [];
  board.innerHTML = ""; // Clear the board
  for (let i = 0; i < width * width; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-id", i);
    cell.setAttribute(
      "data-type",
      colors[Math.floor(Math.random() * colors.length)]
    );
    cell.addEventListener("click", () => selectCell(cell));
    cells.push(cell);
    board.appendChild(cell);
  }
  // Check if there are matches and regenerate the board if necessary
  if (checkInitialMatches()) {
    createBoard();
  }
  enableBoard(); // Enable the board after creation
}

// Add other necessary functions like drag and drop handlers, match checkers, etc.

document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("title-page").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  createBoard();
  startTimer();
});

function showPopup(message) {
  document.getElementById("popup-message").textContent = message;
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function hidePopup() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

function showIngredientPopup() {
  const popup = document.getElementById("ingredient-popup");
  popup.style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Function to handle ingredient selection
function selectIngredient(ingredient) {
  const countSpan = document.getElementById(ingredient + "-matched");
  countSpan.textContent = parseInt(countSpan.textContent) + 2;
  hideIngredientPopup();
}

function hideIngredientPopup() {
  const popup = document.getElementById("ingredient-popup");
  popup.style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

document.getElementById("play-again-button").addEventListener("click", () => {
  hidePopup();
  resetGame();
});

// Create the game board
function createBoard() {
  cells = [];
  board.innerHTML = ""; // Clear the board
  for (let i = 0; i < width * width; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-id", i);
    cell.setAttribute(
      "data-type",
      colors[Math.floor(Math.random() * colors.length)]
    );
    cell.addEventListener("click", () => selectCell(cell));
    cells.push(cell);
    board.appendChild(cell);
  }
  // Check if there are matches and regenerate the board if necessary
  if (checkInitialMatches()) {
    createBoard();
  }
}

function checkInitialMatches() {
  let matches = [];
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const type = cell.getAttribute("data-type");

    // Check horizontal match
    if (
      i % width < width - 2 &&
      type === cells[i + 1].getAttribute("data-type") &&
      type === cells[i + 2].getAttribute("data-type")
    ) {
      matches.push(i, i + 1, i + 2);
    }

    // Check vertical match
    if (
      i < width * (width - 2) &&
      type === cells[i + width].getAttribute("data-type") &&
      type === cells[i + 2 * width].getAttribute("data-type")
    ) {
      matches.push(i, i + width, i + 2 * width);
    }
  }
  return matches.length > 0;
}

// Call createBoard to initialize the game board
createBoard();

let selectedCell = null;

function selectCell(cell) {
  if (selectedCell) {
    if (selectedCell === cell) {
      // Deselect the cell if it is the same as the selected one
      selectedCell.classList.remove("selected");
      selectedCell = null;
    } else {
      swapCells(selectedCell, cell);
      selectedCell.classList.remove("selected");
      cell.classList.remove("selected");
      selectedCell = null;
    }
  } else {
    selectedCell = cell;
    cell.classList.add("selected");
  }
}

function swapCells(cell1, cell2) {
  const tempType = cell1.getAttribute("data-type");
  cell1.setAttribute("data-type", cell2.getAttribute("data-type"));
  cell2.setAttribute("data-type", tempType);
  checkMatches();
}

function checkMatches() {
  let matches = [];
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const type = cell.getAttribute("data-type");

    // Check horizontal match
    if (
      i % width < width - 2 &&
      type === cells[i + 1].getAttribute("data-type") &&
      type === cells[i + 2].getAttribute("data-type")
    ) {
      matches.push(i, i + 1, i + 2);
    }

    // Check vertical match
    if (
      i < width * (width - 2) &&
      type === cells[i + width].getAttribute("data-type") &&
      type === cells[i + 2 * width].getAttribute("data-type")
    ) {
      matches.push(i, i + width, i + 2 * width);
    }
  }
  if (matches.length > 0) {
    handleMatches(matches);
  }
}

function handleMatches(matches) {
  let matchedTypes = {};
  let uniqueMatches = new Set();

  matches.forEach((index) => {
    const cell = cells[index];
    const type = cell.getAttribute("data-type");
    uniqueMatches.add(type);
    cell.classList.add("match");
  });

  let matchCostTotal =
    (matches.length >= discountMatchSize ? discountCost : matchCost) *
    (matches.length / 3);
  updateMoney(-matchCostTotal); // Deduct money

  uniqueMatches.forEach((type) => {
    matchedTypes[type] = 1; // Set to 1 since each type counts as a single match
  });

  setTimeout(() => {
    matches.forEach((index) => {
      const cell = cells[index];
      cell.classList.remove("match");
      cell.setAttribute("data-type", "");
    });
    updateMatchCounts(matchedTypes, "increase"); // Increase counts for matches
    dropCells();
  }, 500);
}

document.querySelectorAll(".power-up").forEach((button, index) => {
  button.addEventListener("click", () => {
    alert(`Power-up ${index + 1} clicked`);
    // Implement the functionality for each power-up here
  });
});

// Function to reset the board
function resetBoard() {
  createBoard();
}

// Function to add money for 8 bowls of namtok noodles
function addNamtokMoney() {
  updateMoney(8 * noodlePrices["Nam Tok Noodles"]);
}

// Function to increase the timer by 20 seconds
function increaseTime() {
  if (timeLeft <= initialTime - 20) {
    timeLeft += 20;
  } else {
    timeLeft = initialTime;
  }
}

/* 
document.getElementById("power-up-1").addEventListener("click", resetBoard);
document.getElementById("power-up-2").addEventListener("click", showIngredientPopup);
document.getElementById("power-up-3").addEventListener("click", addNamtokMoney);
document.getElementById("power-up-4").addEventListener("click", increaseTime);
*/

function updateMatchCounts(matchedTypes, operation = "increase") {
  // Loop through each type in the matchedTypes object
  for (let type in matchedTypes) {
    // Check if the type exists in matchesCount
    if (matchesCount[type] !== undefined) {
      // Increase or decrease the count for that type
      if (operation === "increase") {
        matchesCount[type] += matchedTypes[type];
      } else if (operation === "decrease") {
        matchesCount[type] -= matchedTypes[type];
        if (matchesCount[type] < 0) {
          matchesCount[type] = 0; // Prevent negative values
        }
      }
    }
  }

  // Update the display to show the new counts
  document.getElementById("red-matched").textContent = matchesCount["1"];
  document.getElementById("green-matched").textContent = matchesCount["2"];
  document.getElementById("blue-matched").textContent = matchesCount["3"];
  document.getElementById("purple-matched").textContent = matchesCount["4"];
  document.getElementById("yellow-matched").textContent = matchesCount["5"];
  document.getElementById("lime-matched").textContent = matchesCount["6"];
  document.getElementById("teal-matched").textContent = matchesCount["7"];
  document.getElementById("pink-matched").textContent = matchesCount["8"];

  // Check if the stage is cleared
  checkStageClear();
}

function checkStageClear() {
  if (money >= moneyTarget) {
    clearInterval(timer);
    disableBoard(); // Disable the board
    showPopup("Stage Clear! Want to play again?");
  }
}

function dropCells() {
  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].getAttribute("data-type") === "") {
      let aboveIndex = i - width;
      while (
        aboveIndex >= 0 &&
        cells[aboveIndex].getAttribute("data-type") === ""
      ) {
        aboveIndex -= width;
      }
      if (aboveIndex >= 0) {
        cells[i].setAttribute(
          "data-type",
          cells[aboveIndex].getAttribute("data-type")
        );
        cells[aboveIndex].setAttribute("data-type", "");
      } else {
        cells[i].setAttribute(
          "data-type",
          colors[Math.floor(Math.random() * colors.length)]
        );
      }
    }
  }
  setTimeout(checkMatches, 100);
}

// Timer variables and functions
const timerElement = document.getElementById("timer");
const initialTime = 180; // Set your desired time limit
let timeLeft = initialTime;

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft < 0) {
      clearInterval(timer);
      disableBoard(); // Disable the board
      showPopup("Time's Up! Want to play again?");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = initialTime;
  updateTimer();
  startTimer();
}

function updateTimer() {
  const percentage = (timeLeft / initialTime) * 100;
  timerElement.style.height = `${percentage}%`;
  if (percentage <= 0) {
    timerElement.style.height = "0%"; // Ensure the timer is completely empty
  }
}

function disableBoard() {
  cells.forEach((cell) => {
    cell.style.pointerEvents = "none";
  });
}

function enableBoard() {
  cells.forEach((cell) => {
    cell.style.pointerEvents = "auto";
  });
}

const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const playAgainButton = document.getElementById("play-again-button");

playAgainButton.addEventListener("click", () => {
  popup.style.display = "none";
  resetGame();
});

function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = "block";
}

function resetGame() {
  resetTimer();
  // Reset match counts
  for (let type in matchesCount) {
    matchesCount[type] = 0;
  }
  // Update match count displays
  document.getElementById("red-matched").textContent = matchesCount["1"];
  document.getElementById("green-matched").textContent = matchesCount["2"];
  document.getElementById("blue-matched").textContent = matchesCount["3"];
  document.getElementById("purple-matched").textContent = matchesCount["4"];
  document.getElementById("yellow-matched").textContent = matchesCount["5"];
  document.getElementById("lime-matched").textContent = matchesCount["6"];
  document.getElementById("teal-matched").textContent = matchesCount["7"];
  document.getElementById("pink-matched").textContent = matchesCount["8"];
  // Reset money
  money = 1000; // Starting money
  document.getElementById("money").textContent = money;
  // Recreate the board
  createBoard();
  enableBoard(); // Enable the board
}

let money = 1000; // Starting money

function updateMoney(amount) {
  money += amount;
  document.getElementById("money").textContent = money;
  checkStageClear(); // Check if stage is clear after updating money
}

const matchCost = 10; // Cost per match
const discountMatchSize = 4; // Size of match for discount
const discountCost = 6; // Discounted cost
const noodlePrices = {
  "Tom Yum Noodles": 130,
  "Yen Ta Fo Noodles": 140,
  "Clear Broth Noodles": 120,
  "Nam Tok Noodles": 150,
};

function sellNoodle(noodleType) {
  let requiredColors = [];
  switch (noodleType) {
    case "Tom Yum Noodles":
      requiredColors = ["1", "2", "4", "6"]; // Red, Green, Purple, Lime
      break;
    case "Yen Ta Fo Noodles":
      requiredColors = ["1", "2", "4", "8"]; // Red, Green, Purple, Teal
      break;
    case "Clear Broth Noodles":
      requiredColors = ["1", "2", "4", "7"]; // Red, Green, Purple, Pink
      break;
    case "Nam Tok Noodles":
      requiredColors = ["1", "3", "4", "5"]; // Red, Blue, Purple, Yellow
      break;
  }

  // Check if the player has the required colors in sufficient quantity
  let canSell = requiredColors.every((color) => matchesCount[color] > 0);

  if (canSell) {
    // Prepare matchedTypes object for the decrease operation
    let matchedTypes = {};
    requiredColors.forEach((color) => {
      matchedTypes[color] = 1; // Count each color as used
    });

    // Deduct the materials
    updateMatchCounts(matchedTypes, "decrease");

    // Update money
    updateMoney(noodlePrices[noodleType]);

    alert(`Sold ${noodleType}!`);
  } else {
    alert("Not enough ingredients.");
  }
}

function checkNoodleCombination(colors) {
  // Check if player has the required colors (implement your logic)
  return true; // Placeholder
}

function checkNoodleCombination(colors) {
  // Implement your logic to check if the player has the required colors
  // For example:
  return colors.every((color) => matchesCount[color] > 0);
}
