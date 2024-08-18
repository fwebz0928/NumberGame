let slots = [];
let currentNumber = 0;
let totalSlots = 10; // Default to 10 slots
let game_over = false;

document.getElementById("game_button").addEventListener("click", startNewGame);

function startNewGame() {
  game_over = false;
  slots = Array(totalSlots).fill(null);
  document.getElementById("status").innerText = "";
  document.getElementById("generated_number").innerText = "1-1000";
  document.getElementById("game_button").innerText = "New Game";
  updateSlots();
  updateCurrentNumber();
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 1000) + 1;
}

function updateCurrentNumber() {
  currentNumber = generateRandomNumber();
  document.getElementById("generated_number").innerText = `${currentNumber}`;

  if (checkGameOver()) {
    updateStatus("Lost!");
    game_over = true;
    document.getElementById("game_button").innerText = "Play Again";
  } else {
    console.log("Game not over");
  }
}

function checkGameOver() {
  for (let i = 0; i < slots.length; i++) {
    if (slots[i] === null) {
      // Determine the valid range for this empty slot
      let prevValue = -Infinity;
      let nextValue = Infinity;

      // Find the closest filled slot before the current index
      for (let j = i - 1; j >= 0; j--) {
        if (slots[j] !== null) {
          prevValue = slots[j];
          break;
        }
      }

      // Find the closest filled slot after the current index
      for (let j = i + 1; j < slots.length; j++) {
        if (slots[j] !== null) {
          nextValue = slots[j];
          break;
        }
      }

      // Check if the current number can fit in this slot
      if (currentNumber > prevValue && currentNumber < nextValue) {
        return false; // There is a valid place for the current number
      }
    }
  }
  return true; // No valid place found, game over
}

function place_number(index) {
  if (slots[index] !== null || game_over) {
    return; // Slot already filled, do nothing
  }

  const prevValue =
    index > 0 && slots[index - 1] !== null ? slots[index - 1] : -Infinity;
  const nextValue =
    index < slots.length - 1 && slots[index + 1] !== null
      ? slots[index + 1]
      : Infinity;

  if (currentNumber > prevValue && currentNumber < nextValue) {
    slots[index] = currentNumber; // Place the number in the selected slot
    updateSlots(); // Update the slots on the UI

    if (slots.every((slot) => slot !== null)) {
      updateStatus("Won!");
      document.getElementById("game_button").innerText = "Play Again";
    } else {
      updateCurrentNumber(); // Generate a new number for the next round
    }
  } else {
    updateStatus("Lost!");
    document.getElementById("game_button").innerText = "Play Again";
  }
}

function updateSlots() {
  const slotsContainer = document.getElementById("slots_container");
  slotsContainer.innerHTML = ""; // Clear existing slots

  slots.forEach((number, index) => {
    const slotDiv = document.createElement("div");
    slotDiv.classList.add("slot");

    const numberDiv = document.createElement("div");
    numberDiv.classList.add("slot-number");

    // Add the slot index number
    numberDiv.textContent = `${index + 1}.`;

    const slotContentDiv = document.createElement("div");
    if (number === null) {
      slotDiv.classList.add("empty");
      slotDiv.addEventListener("click", () => place_number(index));
    } else {
      slotContentDiv.textContent = number;
    }

    // Append both the slot number and content to the slot div
    slotDiv.appendChild(numberDiv);
    slotDiv.appendChild(slotContentDiv);

    // Add the slot div to the container
    slotsContainer.appendChild(slotDiv);
  });
}

function updateStatus(status_text) {
  const status_div = document.getElementById("status");
  status_div.textContent = status_text;
  status_div.style.color = status_text.startsWith("Lost") ? "red" : "green";
  status_div.style.opacity = 1;
  status_div.style.visibility = "visible";
}

document.getElementById("ten_slot_button").addEventListener("click", () => {
  totalSlots = 10;
  startNewGame();
});

document.getElementById("twenty_slot_button").addEventListener("click", () => {
  totalSlots = 20;
  startNewGame();
});

document.getElementById("toggle_button").addEventListener("click", () => {
  const instructions = document.getElementById("instructions");
  const arrow = document.getElementById("arrow");

  // Toggle the class that controls the visibility
  if (instructions.classList.contains("open")) {
    instructions.classList.remove("open");
    arrow.style.transform = "rotate(0deg)";
  } else {
    instructions.classList.add("open");
    arrow.style.transform = "rotate(180deg)";
  }
});

// Initialize the game with 10 slots
startNewGame();
