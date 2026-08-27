export const CUP_COUNT = 3;
export const WINS_NEEDED = 3;

export function createGame() {
  return {
    phase: "ready",
    round: 1,
    streak: 0,
    hiddenCupId: null,
    winningCup: null,
    selectedCup: null,
    message: "Watch the buckeye, then follow the cups.",
  };
}

export function startRound(state, random = Math.random) {
  if (!["ready", "correct"].includes(state.phase)) {
    throw new Error("A round cannot start from the current phase.");
  }

  return {
    ...state,
    phase: "covering",
    hiddenCupId: Math.floor(random() * CUP_COUNT),
    winningCup: null,
    selectedCup: null,
    message: "Keep your eyes on the cup…",
  };
}

export function beginShuffle(state) {
  if (state.phase !== "covering") {
    throw new Error("Only a covered buckeye can begin shuffling.");
  }

  return { ...state, phase: "shuffling", message: "Track the cup! 15 seconds to go." };
}

export function finishShuffle(state, winningCup) {
  if (state.phase !== "shuffling") {
    throw new Error("Only a shuffling round can become guessable.");
  }
  if (!Number.isInteger(winningCup) || winningCup < 0 || winningCup >= CUP_COUNT) {
    throw new Error("The final cup position is invalid.");
  }

  return { ...state, phase: "guessing", winningCup, message: "Where's the buckeye? Pick a cup." };
}

export function chooseCup(state, cupIndex) {
  if (state.phase !== "guessing") {
    throw new Error("Choose a cup only after the shuffle finishes.");
  }
  if (!Number.isInteger(cupIndex) || cupIndex < 0 || cupIndex >= CUP_COUNT) {
    throw new Error("Unknown cup.");
  }

  const correct = cupIndex === state.winningCup;
  const streak = correct ? state.streak + 1 : 0;
  const won = streak === WINS_NEEDED;

  return {
    ...state,
    phase: correct ? (won ? "won" : "correct") : "lost",
    streak,
    selectedCup: cupIndex,
    message: correct
      ? won
        ? "Three straight! You own the Oval."
        : "Found it! One step closer to glory."
      : "Not there. The buckeye was under another cup.",
  };
}
