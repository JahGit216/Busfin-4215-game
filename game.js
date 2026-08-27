export const CUP_COUNT = 3;
export const WINS_NEEDED = 3;

export function createGame() {
  return {
    phase: "ready",
    round: 1,
    streak: 0,
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
    phase: "shuffling",
    winningCup: Math.floor(random() * CUP_COUNT),
    selectedCup: null,
    message: "Keep your eyes on the cup…",
  };
}

export function finishShuffle(state) {
  if (state.phase !== "shuffling") {
    throw new Error("Only a shuffling round can become guessable.");
  }

  return { ...state, phase: "guessing", message: "Where's the buckeye? Pick a cup." };
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
