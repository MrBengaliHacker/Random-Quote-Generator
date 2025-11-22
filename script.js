// Select DOM elements
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const btn = document.getElementById("btn");
const copyBtn = document.getElementById("copyBtn");
const clickSound = document.getElementById("clickSound");

// Cached quotes for instant switching
let quotePool = [];
let index = 0;

// Play click sound when user interacts
function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

// Show loading spinner and disable button
function setLoading() {
  btn.disabled = true;
  btn.textContent = "Loading...";
  quoteEl.innerHTML = `<div class="loader"></div>`;
  authorEl.textContent = "";
}

// Re-enable button after update completed
function enableButton() {
  btn.disabled = false;
  btn.textContent = "Generate Quote";
}

// Fetch a batch of quotes once and reuse them for instant responses
async function preloadQuotes() {
  try {
    const res = await fetch("https://dummyjson.com/quotes?limit=150");
    const data = await res.json();
    quotePool = data.quotes;

    // First time load → instantly show quote
    if (index === 0) showNextQuote();

  } catch (error) {
    console.error("Preload failed:", error);
    updateUI("API ERROR!", "No data");
  }
}

// Show next cached quote smoothly
function showNextQuote() {
  if (!quotePool.length) {
    updateUI("Loading...", "");
    preloadQuotes();
    return;
  }

  // Restart cycle when reaching end
  if (index >= quotePool.length) {
    index = 0;
    preloadQuotes(); // Refresh data silently in background
  }

  const q = quotePool[index];
  updateUI(q.quote, q.author);
  index++;
}

// Update UI with fade animation
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

// Generate button click handler
btn.addEventListener("click", () => {
  playClickSound();
  setLoading();

  // Small delay to ensure loader visible
  setTimeout(() => {
    showNextQuote();
    enableButton();
  }, 250);
});

// Copy quote text to clipboard
copyBtn.addEventListener("click", () => {
  playClickSound();
  const copyText = `${quoteEl.textContent} ${authorEl.textContent}`;
  navigator.clipboard.writeText(copyText);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy Quote"), 1200);
});

// Load quotes initially on startup
preloadQuotes();