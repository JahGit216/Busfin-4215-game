import { beginShuffle, chooseCup, createGame, finishShuffle, getShuffleTempo, startRound, WINS_NEEDED } from "./game.js";

const board = document.querySelector("#cup-board");
const cups = [...document.querySelectorAll(".cup-button")];
const buckeye = document.querySelector("#buckeye");
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
let timers = [];
let cupSlots = [0, 1, 2];
const SHUFFLE_DURATION = 10_000;

const wait = (milliseconds) => new Promise((resolve) => {
  const timer = setTimeout(resolve, milliseconds);
  timers.push(timer);
});

function positionPieces() {
  cups.forEach((cup, id) => cup.style.setProperty("--slot", cupSlots[id]));
  const carrierSlot = state.hiddenCupId === null ? 1 : cupSlots[state.hiddenCupId];
  buckeye.style.setProperty("--slot", carrierSlot);
}

function setRoundTempo() {
  const tempo = getShuffleTempo(state.round);
  board.style.setProperty("--move-duration", `${tempo.moveDuration}ms`);
  return tempo;
}

function randomMove() {
  const first = Math.floor(Math.random() * 3);
  let second = Math.floor(Math.random() * 2);
  if (second >= first) second += 1;

  if (Math.random() < 0.28) {
    const third = 3 - first - second;
    const oldFirst = cupSlots[first];
    cupSlots[first] = cupSlots[second];
    cupSlots[second] = cupSlots[third];
    cupSlots[third] = oldFirst;
  } else {
    [cupSlots[first], cupSlots[second]] = [cupSlots[second], cupSlots[first]];
  }
  positionPieces();
}

function render() {
  document.body.dataset.phase = state.phase;
  message.textContent = state.message;
  roundLabel.textContent = `Round ${Math.min(state.round, WINS_NEEDED)} of ${WINS_NEEDED}`;
  setRoundTempo();
  startButton.hidden = !["ready", "correct"].includes(state.phase);
  startButton.textContent = state.phase === "correct" ? "Shuffle again" : "Start the shuffle";
  board.classList.toggle("is-shuffling", state.phase === "shuffling");
  board.classList.toggle("is-covering", state.phase === "covering");
  board.classList.toggle("is-guessing", state.phase === "guessing");
  board.classList.toggle("is-revealed", ["correct", "lost", "won"].includes(state.phase));

  streakDots.forEach((dot, index) => {
    dot.classList.toggle("is-earned", index < state.streak);
  });

  cups.forEach((cup, index) => {
    const canGuess = state.phase === "guessing";
    const reveal = ["correct", "lost", "won"].includes(state.phase) && cupSlots[index] === state.winningCup;
    cup.disabled = !canGuess;
    cup.classList.toggle("is-revealed", reveal);
    cup.classList.toggle("is-wrong", state.phase === "lost" && cupSlots[index] === state.selectedCup);
    cup.setAttribute("aria-label", canGuess ? `Choose cup position ${cupSlots[index] + 1}` : `Cup ${index + 1}`);
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

async function beginRound() {
  state = startRound(state);
  cupSlots = [0, 1, 2];
  positionPieces();
  render();
  await wait(1400);
  if (state.phase !== "covering") return;
  state = beginShuffle(state);
  render();
  const tempo = setRoundTempo();

  const started = performance.now();
  while (state.phase === "shuffling" && performance.now() - started < SHUFFLE_DURATION) {
    randomMove();
    const secondsLeft = Math.max(1, Math.ceil((SHUFFLE_DURATION - (performance.now() - started)) / 1000));
    message.textContent = `Track the cup! ${secondsLeft} second${secondsLeft === 1 ? "" : "s"} to go.`;
    const remaining = SHUFFLE_DURATION - (performance.now() - started);
    const nextMoveDelay = tempo.minPause + Math.random() * (tempo.maxPause - tempo.minPause);
    await wait(Math.max(0, Math.min(nextMoveDelay, remaining)));
  }
  if (state.phase !== "shuffling") return;
  state = finishShuffle(state, cupSlots[state.hiddenCupId]);
  render();
  cups.find((cup) => cupSlots[cups.indexOf(cup)] === 0)?.focus();
}

function selectCup(cupId) {
  state = chooseCup(state, cupSlots[cupId]);
  if (state.phase === "correct") state = { ...state, round: state.round + 1 };
  render();
}

function reset() {
  timers.forEach(clearTimeout);
  timers = [];
  state = createGame();
  cupSlots = [0, 1, 2];
  positionPieces();
  overlay.hidden = true;
  render();
  startButton.focus();
}

startButton.addEventListener("click", beginRound);
restartButton.addEventListener("click", reset);
overlayRestart.addEventListener("click", reset);
cups.forEach((cup, index) => cup.addEventListener("click", () => selectCup(index)));
positionPieces();
render();
