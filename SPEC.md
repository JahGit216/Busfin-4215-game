# Four-Sentence Game Specification

1. The player is an **Ohio State student** trying to **pick the golden cup hiding a buckeye**.
2. The visible state consists of **three golden cups, a buckeye, the current round, and a three-win streak meter**.
3. On each turn, the buckeye is randomly placed, the cups shuffle, and the player chooses one cup; a correct choice fills one streak marker and an incorrect choice ends the run.
4. The game ends when the player **guesses correctly three times in a row** or **guesses incorrectly**, and the player can restart without reloading the page.

## Definition of done

- [x] The public URL opens while signed out.
- [x] A first-time user can state the goal without creator narration.
- [x] Every button changes visible state or gives useful feedback.
- [x] At least one ending can be reached deliberately.
- [x] Restart returns the game to a clean initial state.
- [x] Keyboard navigation and focus are visible.
