# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build.
2. Update the README.md with details of changes to the interface, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Code conventions

- File and folder names use kebab-case (e.g. `board-end-game/board-end-game.tsx`).
- No barrel files: do not create `index.ts(x)` files, import the file you need directly (e.g. `@components/button/button`).
- Tests live next to the file under test, inside a `__tests__` folder (e.g. `src/services/__tests__/game.test.ts`).
- Code is formatted with Prettier (tabs, single quotes, no semicolons): run `yarn format` before committing, CI runs `yarn format:check`.
- Accessibility is enforced: `yarn lint` (jsx-a11y) and `yarn test:a11y` (axe-core and color contrast) fail on any violation. Use real buttons, labels and landmarks, and add the new states to `src/__tests__/a11y.test.tsx`.
- Run `yarn test` before opening a pull request. Coverage is reported on every run and the build fails when statements, branches, functions or lines drop below 95%.
