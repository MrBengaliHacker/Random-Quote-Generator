const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const btn = document.getElementById("btn");
const copyBtn = document.getElementById("copyBtn");
const clickSound = document.getElementById("clickSound");

let quotePool = [];
let index = 0;

// Preload Audio
clickSound.preload = "auto";
clickSound.volume = 0.9; // Slight boost for mobile clarity

// Unlock audio on mobile with first interaction
function unlockAudio() {
  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('click', unlockAudio);
  }).catch(() => {});
}

document.addEventListener('touchstart', unlockAudio);
document.addEventListener('click', unlockAudio);

// Play click sound
function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

// Button loading state
function setLoading() {
  btn.disabled = true;
  btn.textContent = "Loading...";
  quoteEl.innerHTML = `<div class="loader"></div>`;
  authorEl.textContent = "";
}

function enableButton() {
  btn.disabled = false;
  btn.textContent = "Generate Quote";
}

// Preload 150 quotes once for FAST switching
async function preloadQuotes() {
  try {
    const res = await fetch("https://dummyjson.com/quotes?limit=150");
    const data = await res.json();
    quotePool = data.quotes;
    if (index === 0) showNextQuote(); // Show instantly first time
  } catch (error) {
    console.error("Preload failed:", error);
    updateUI("API ERROR!", "No data");
  }
}

// Show quotes one-by-one fast
function showNextQuote() {
  if (!quotePool.length) {
    preloadQuotes();
    return;
  }

  if (index >= quotePool.length) index = 0; // repeat cycle

  const q = quotePool[index];
  updateUI(q.quote, q.author);
  index++;
}

// Update UI text with fade animation
function updateUI(text, author) {
  quoteEl.textContent = text;
  authorEl.textContent = author ? `— ${author}` : "";
  quoteEl.style.animation = "fadeText 0.4s";
  authorEl.style.animation = "fadeText 0.4s";
  setTimeout(() => {
    quoteEl.style.animation = "";
    authorEl.style.animation = "";
  }, 400);
}

// Button click
btn.addEventListener("click", () => {
  playClickSound();
  setLoading();
  setTimeout(() => {
    showNextQuote();
    enableButton();
  }, 250);
});

// Copy button click
copyBtn.addEventListener("click", () => {
  playClickSound();
  const text = `${quoteEl.textContent} ${authorEl.textContent}`;
  navigator.clipboard.writeText(text);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy Quote"), 1200);
});

// Load quotes first time
preloadQuotes();
