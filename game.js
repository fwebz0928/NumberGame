let slots = [];
let currentNumber = 0;
let totalSlots = 10; // Default to 10 slots
let game_over = false;
let auto_number = false;

document.getElementById("game_button").addEventListener("click", startNewGame);

function startNewGame() {
  game_over = false;
  slots = Array(totalSlots).fill(null);
  document.getElementById("status").textContent = "";
  document.getElementById("generated_number").textContent = "1-1000";
  document.getElementById("game_button").textContent = "New Game";
  updateSlots();
  updateCurrentNumber();
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 1000) + 1;
}

function updateCurrentNumber() {
  currentNumber = generateRandomNumber();
  document.getElementById("generated_number").textContent = `${currentNumber}`;

  if (checkGameOver()) {
    updateStatus("Lost!");
    game_over = true;
    document.getElementById("game_button").textContent = "Play Again";
  } else {
    console.log("Game not over");
  }
}

function checkGameOver() {
  for (let i = 0; i < slots.length; i++) {
    if (slots[i] === null) {
      let prevValue = -Infinity;
      let nextValue = Infinity;

      for (let j = i - 1; j >= 0; j--) {
        if (slots[j] !== null) {
          prevValue = slots[j];
          break;
        }
      }

      for (let j = i + 1; j < slots.length; j++) {
        if (slots[j] !== null) {
          nextValue = slots[j];
          break;
        }
      }
      if (currentNumber > prevValue && currentNumber < nextValue) {
        return false;
      }
    }
  }
  return true;
}

function place_number(index) {
  // Slot already filled, do nothing
  if (slots[index] !== null || game_over) {
    return;
  }

  const prevValue =
    index > 0 && slots[index - 1] !== null ? slots[index - 1] : -Infinity;
  const nextValue =
    index < slots.length - 1 && slots[index + 1] !== null
      ? slots[index + 1]
      : Infinity;

  if (currentNumber > prevValue && currentNumber < nextValue) {
    slots[index] = currentNumber;
    updateSlots();

    if (slots.every((slot) => slot !== null)) {
      updateStatus("Won!");
      document.getElementById("game_button").innerText = "Play Again";
    } else {
      if (auto_number) updateCurrentNumber();
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

    slotDiv.appendChild(numberDiv);
    slotDiv.appendChild(slotContentDiv);
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

function setupCheckbox() {
  const check_box = document.getElementById("new_number_box");
  check_box.addEventListener("change", () => {
    const next_num_button = document.getElementById("next_num_button");
    if (check_box.checked) {
      next_num_button.style.display = "none";
      auto_number = true;
    } else {
      next_num_button.style.display = "block";
      auto_number = false;
    }
  });
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

document.getElementById("next_num_button").addEventListener("click", () => {
  if (auto_number === false) updateCurrentNumber();
});

// Initialize the game with 10 slots
startNewGame();
setupCheckbox();
