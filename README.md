# mosa

mosa is a tool you can use to send [t-code][t-code-spec] to a compatible device over serial using the [web serial API][webserial].

In Google Chrome, you should be able to connect a device which accepts [t-code][t-code-spec] and then use web controls to send commands in a visual/intuitive way.

## Running / Developing Locally

To get started running locally, you will need [`nodejs`][nodejs] and [`npm`][npm] installed.

As you have nodejs and npm installed, open the project directory with your favorite shell.

Run `npm install` (in the same directory as `package.json`).

Once installation completes:

- to run the app in development mode, run `npm start` and open [http://localhost:8000](http://localhost:8000) to view it in the
  browser. The page will reload if you make edits. You will also see any lint errors in the console.

- to build the app for production, run `npm build`. This will build the app for production to the `build` folder, making some optimizations for the best performance. You can then run `npm run serve` to serve the production build locally.

## Context

This started out as an experiment in [React][reactjs]/[Gatsby][gatsbyjs] using [web serial][webserial] to interface with OSR firmware and hardware, primarily by producing [t-code][t-code-spec] to be used by the OSR3, OSR2, and now SR6 as developed by [Tempest][tempestvr].

Made possible by the [Web Serial API][webserial]. Bootstrapped with [Gatsby][gatsbyjs] & the [material-ui-starter][material-ui-starter].

[nodejs]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[reactjs]: https://reactjs.org/
[gatsbyjs]: https://gatsbyjs.com
[material-ui-starter]: https://material-ui-starter.netlify.com/
[webserial]: https://wicg.github.io/serial/
[t-code-spec]: https://github.com/multiaxis/tcode-spec
[tempestvr]: https://patreon.com/tempestvr
