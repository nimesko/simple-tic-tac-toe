# Accessibility

Tic Tac Toe aims to be playable by as many people as possible. This page describes what is supported today and how to report a problem.

## What is supported

- **Keyboard play:** every cell of the board is a button, reachable with `Tab` and activated with `Enter` or `Space`. The number keys `1`-`9` also play, laid out like a numeric keypad (`7 8 9` is the top row, `1 2 3` the bottom row).
- **Keyboard shortcuts:** `Enter` starts a new game once a game has finished, and `Escape` closes dialogs such as the leaderboard.
- **Screen readers:** cells are named by position and content (for example "Row 1, column 2, X"), and a live status announces whose turn it is, the winner or a tied game. The page has a main landmark, the score is a labelled group, and the leaderboard is a table with a caption and column headers.
- **Dialogs:** they are named, take the focus when they open, keep it inside until closed and give it back to the control that opened them. They can be closed with a close button or `Escape`.
- **Focus:** keyboard focus is always visible, and it moves to "Start New Game" when a game ends, then back to the board.
- **Sound feedback:** distinct sounds play for a move, a win and a tie. Sound can be turned off with the sound toggle. Sound is never the only cue.
- **Colour and motion:** text and interface colours meet WCAG 2.2 AA contrast in both themes. Animations are reduced when the system asks for reduced motion, and the page scrolls instead of clipping when zoomed in.

## Automated checks

Accessibility is checked on every pull request, and the build fails if any check fails:

- `eslint-plugin-jsx-a11y` (strict) runs with `yarn lint`.
- `yarn test:a11y` scans the rendered game with [axe-core](https://github.com/dequelabs/axe-core) (WCAG 2.0, 2.1 and 2.2 A/AA plus best practices) in every state: new game, game in progress, winner, tie, leaderboard (empty and with players) and the player form, in both themes. It also checks the contrast ratio of every theme color pair.

Automated tools find only part of the problems, so please also test with a keyboard and a screen reader when changing the interface.

## Known limitations

- The game has not been formally audited against WCAG, and has not been tested with all screen readers.
- axe-core runs in a simulated browser (jsdom), so checks that need real layout, such as visual overlap, are not covered.

## Reporting an accessibility problem

Please [open an issue](https://github.com/nimesko/simple-tic-tac-toe/issues/new/choose) and include:

- what you were trying to do and what happened instead,
- your browser, operating system and any assistive technology you use.

Accessibility fixes are welcome as pull requests, see [CONTRIBUTING.md](CONTRIBUTING.md).
