<h1 align="center">Simple Tic Tac Toe</h1>
<p align="center">
  A simple Tic Tac Toe game with ranking, playable with keyboard with sound assist.
</p>
<div align="center">
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/nimesko/simple-tic-tac-toe.svg">
  <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/nimesko/simple-tic-tac-toe/main.yml?branch=main">
  <img alt="License" src="https://img.shields.io/github/license/nimesko/simple-tic-tac-toe.svg">
</div>

## Description

This is a simple project I did in my spare time where the goal was to create a web app using React, TypeScript and Vite without using tools like Create React App.

Github Actions was also used to automate issues such as deployment, code checking and other processes related to code change.

## Usage

Node.js 26 or newer is required (`.nvmrc` pins the version, `fnm use` or `nvm use` picks it up). Yarn 4 is required (the version is pinned in `package.json`; install it with `npm i -g @yarnpkg/cli-dist`, or with `npm i -g corepack`, which is no longer bundled with Node.js). Install the dependencies with `yarn`.

Then, you can launch the dev server by executing `yarn start` (use `yarn build` to create a production build in `dist/` and `yarn preview` to serve it locally).

And the last step is to check your browser at `http://localhost:8080/` to start making your changes :)

## Deployment

The site is published to GitHub Pages by the `Deploy to GitHub Pages` job of the CI workflow, after lint, format, accessibility, test and build pass on `main`. In the repository settings, **Settings > Pages > Build and deployment > Source** must be set to **GitHub Actions**.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Good to Know

This library works with SSR (Server Side Rendering, aka Universal Application).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
