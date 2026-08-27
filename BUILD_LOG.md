# AI and Build Log

This log records consequential design decisions and reproducible verification rather than a raw prompt transcript. Times are UTC on 2026-08-27.

| Time | Specification or prompt | What changed | What I inspected or tested | Human judgment |
|---|---|---|---|---|
| 19:25 | Replace the Runway Decisions starter with the Buckeye Shuffle Cup. | Rebuilt the page, state machine, styling, and tests around one hidden buckeye, three cups, and a three-win streak. | Ran the Node test suite, JavaScript syntax checks, and a local 1440×1000 browser screenshot. | The focused shell-game loop matched the four-sentence specification better than the generic starter. |
| 19:30 | Ensure the public URL serves only the new game. | Changed GitHub Pages from the legacy branch publisher to the tested Actions workflow and versioned static assets. | Compared local and remote commits, scanned tracked files for old-game text, and watched the Pages deployment finish. | A versioned public URL was kept so returning browsers would not display stale assets. |
| 19:41 | Make the cups genuinely shuffle and keep the answer correct. | Added one visible buckeye, a randomly chosen carrier cup, irregular two-cup swaps and three-cup cycles, a countdown, and physical cup-position tracking. | Completed a headless-browser flow from start through the full shuffle and cup selection; expanded unit coverage to seven tests. | Tracking cup identity separately from screen position prevents the animation and game answer from disagreeing. |
| 19:46 | Hide the buckeye during play and shorten the wait. | Moved the buckeye beneath its carrier, hid it during shuffling and guessing, revealed it with the answer, and reduced the shuffle to 10 seconds. | Used Playwright to verify opacity `1` initially, opacity `0` during shuffling, and the guessing phase after 10 seconds. | Ten seconds preserves the tracking challenge without making each of the three rounds drag. |
| 19:51 | Smooth the animation and increase difficulty by round. | Added settling time, smoother easing, and round-specific movement tempos: 720 ms, 500 ms, and 330 ms. | Added tempo-progression assertions, ran eight unit tests, and verified the GitHub Pages test/deploy workflow. | A slower first round teaches the interaction; rounds two and three raise difficulty without changing the core rule. |

## Failure and diagnosis

- **Exact symptom:** The buckeye remained visible below the moving cup, so the player could follow the nut instead of the cup.
- **Expected behavior:** Show the buckeye before the round, visibly move it beneath one cup, hide it throughout the shuffle and guess, then reveal it only with the answer.
- **Smallest diagnosis attempted:** Inspected the buckeye and cup stacking/position styles, then checked the buckeye's computed opacity in each game phase with Playwright.
- **Evidence that the fix worked:** The automated browser flow measured opacity `1` before starting and `0` while shuffling, waited through the 10-second round, and reached the guessing state with all three cups selectable.

## Ownership check

- **Most important rule:** A run succeeds only after three correct guesses in a row; one incorrect guess ends the run and resets the streak.
- **Most important design choice:** The game tracks the identity of the cup carrying the buckeye separately from that cup's current screen slot. Every random swap updates the slot map, so the final correct answer always follows the cup the player actually watched.
- **Most important limitation:** The shuffle uses `Math.random()` and CSS transitions rather than a physics engine or cryptographically secure randomness. It is appropriate for a lightweight visual game, but it is not suitable for wagering or security-sensitive use.
