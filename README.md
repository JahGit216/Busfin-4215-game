# The Buckeye Shuffle Cup

A fast browser shell game made for Buckeye Nation. Watch the hidden buckeye, follow three animated golden cups, and pick the right cup three rounds in a row to win.

## Play

Open the [live GitHub Pages game](https://jahgit216.github.io/Busfin-4215-game/), then:

1. Select **Start the shuffle**.
2. Track the cups until the animation stops.
3. Choose the cup hiding the buckeye.
4. Find it three times in a row to earn the winning screen. One miss ends the run.

The game supports mouse, touch, and keyboard play, visible focus, live status announcements, and reduced-motion preferences.

## Run locally

```bash
npm run serve
```

Open <http://localhost:8000>.

## Test

```bash
npm test
```

The tests cover round setup, deterministic cup placement, winning streaks, losses, immutability, and invalid actions.
