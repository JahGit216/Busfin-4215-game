import test from "node:test";
import assert from "node:assert/strict";
import { chooseCup, createGame, finishShuffle, startRound } from "../game.js";

const readyToGuess = (random = () => 0) => finishShuffle(startRound(createGame(), random));

test("a new game begins ready with no streak", () => {
  assert.deepEqual(createGame(), { phase:"ready", round:1, streak:0, winningCup:null, selectedCup:null, message:"Watch the buckeye, then follow the cups." });
});

test("random value determines the winning cup", () => {
  assert.equal(readyToGuess(() => 0.7).winningCup, 2);
});

test("a correct choice advances the streak without mutating state", () => {
  const state = readyToGuess();
  const next = chooseCup(state, 0);
  assert.equal(state.streak, 0);
  assert.equal(next.streak, 1);
  assert.equal(next.phase, "correct");
});

test("three correct choices win the game", () => {
  const state = { ...readyToGuess(), streak:2 };
  assert.equal(chooseCup(state, 0).phase, "won");
});

test("an incorrect choice ends the game and clears the streak", () => {
  const state = { ...readyToGuess(), streak:2 };
  const next = chooseCup(state, 1);
  assert.equal(next.phase, "lost");
  assert.equal(next.streak, 0);
});

test("choices are rejected before the shuffle ends", () => {
  assert.throws(() => chooseCup(createGame(), 0), /after the shuffle/);
});
