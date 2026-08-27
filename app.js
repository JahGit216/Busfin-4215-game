import { chooseCup, createGame, finishShuffle, startRound, WINS_NEEDED } from "./game.js";

const board = document.querySelector("#cup-board");
const cups = [...document.querySelectorAll(".cup-button")];
const message = document.querySelector("#message");
const roundLabel = document.querySelector("#round-label");
const streakDots = [...document.querySelectorAll(".streak-dot")];
const startButton = document.querySelector("#start-button");
const restartButton = document.querySelector("#restart-button");
const overlay = document.querySelector("#result-overlay");
const overlayKicker = document.querySelector("#overlay-kicker");
const overlayTitle = document.querySelector("#overlay-title");
const overlayCopy = document.querySelector("#overlay-copy");
const overlayRestart = document.querySelector("#overlay-restart");

let state = createGame();
let shuffleTimer;

function render() {
  document.body.dataset.phase = state.phase;
  message.textContent = state.message;
  roundLabel.textContent = `Round ${Math.min(state.round, WINS_NEEDED)} of ${WINS_NEEDED}`;
  startButton.hidden = !["ready", "correct"].includes(state.phase);
  startButton.textContent = state.phase === "correct" ? "Shuffle again" : "Start the shuffle";
  board.classList.toggle("is-shuffling", state.phase === "shuffling");

  streakDots.forEach((dot, index) => {
    dot.classList.toggle("is-earned", index < state.streak);
  });

  cups.forEach((cup, index) => {
    const canGuess = state.phase === "guessing";
    const reveal = ["correct", "lost", "won"].includes(state.phase) && index === state.winningCup;
    cup.disabled = !canGuess;
    cup.classList.toggle("is-revealed", reveal);
    cup.classList.toggle("is-wrong", state.phase === "lost" && index === state.selectedCup);
    cup.setAttribute("aria-label", canGuess ? `Choose cup ${index + 1}` : `Cup ${index + 1}`);
  });

  const ended = state.phase === "won" || state.phase === "lost";
  overlay.hidden = !ended;
  if (ended) {
    const won = state.phase === "won";
    overlayKicker.textContent = won ? "Perfect streak" : "The buckeye got away";
    overlayTitle.textContent = won ? "Buckeye legend!" : "Big. Cup. Energy.";
    overlayCopy.textContent = won
      ? "You tracked the buckeye three times in a row. Brutus would be proud."
      : `You made it to round ${state.round}. Reset, refocus, and give it another shot.`;
    requestAnimationFrame(() => overlayRestart.focus());
  }
}

function beginRound() {
  state = startRound(state);
  render();
  clearTimeout(shuffleTimer);
  shuffleTimer = setTimeout(() => {
    state = finishShuffle(state);
    render();
    cups[0].focus();
  }, 2100);
}

function selectCup(index) {
  state = chooseCup(state, index);
  if (state.phase === "correct") state = { ...state, round: state.round + 1 };
  render();
}

function reset() {
  clearTimeout(shuffleTimer);
  state = createGame();
  overlay.hidden = true;
  render();
  startButton.focus();
}

startButton.addEventListener("click", beginRound);
restartButton.addEventListener("click", reset);
overlayRestart.addEventListener("click", reset);
cups.forEach((cup, index) => cup.addEventListener("click", () => selectCup(index)));
render();
