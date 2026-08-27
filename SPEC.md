# Four-Sentence Game Specification

Replace every bracketed prompt before asking an agent to build.

1. The player is **[Ohio State student]** trying to **[pick a hidden buckeye under a cup]**.
2. The visible state consists of **[three golden cups and a buckeye nut]**.
3. On each turn, the player chooses **[buckeye nut is placed under cup then shuffled, player chooses the winner]**, and each action changes the state according to **[if the player correctly guesses which cup the nut is under]**.
4. The game ends when **[player guesses correct three times in a row]**, **[player guesses incorrectly (big loser screen)]**, and the player can restart without reloading the page.

## Definition of done

- [ ] The public URL opens while signed out.
- [ ] A first-time user can state the goal without creator narration.
- [ ] Every button changes visible state or gives useful feedback.
- [ ] At least one ending can be reached deliberately.
- [ ] Restart returns the game to a clean initial state.
- [ ] Keyboard navigation and focus are visible.
