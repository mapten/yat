# Yes another todolist

This is a demo project. It is a simple todolist, in which is possible to create, edit, and delete tasks.

## Technologies

This project uses:

- React.
- Typescript.
- Jest.
- Cypress.
- Storybook.
- SASS.
- Redux.
- Redux Saga.
- ESLint.
- Mirage.js.
- JsDoc.

### Local Fake API

The application uses [mirage-js](https://miragejs.com/) to work with a in-memory local fake API server. This is an efficient way of working with frontend applications, being agnostic from real (testing or production) API's.

### Atomic Design Principles

The project is built based in the [atomic design principles](https://bradfrost.com/blog/post/atomic-web-design/). The components are divided into different types (atoms, particles, molecules, etc). Each component is atomic, with no dependencies (except the components connected to Redux). Each component can be visualized and manually tested with Storybook.

### Redux as the brain

Most of the business logic is done in Redux. Working in this way, allows to the component to be lighweight, and easier to test and to modify.

The side effects related to Redux, is in the middleware, managed by Redux Saga. That means that for example the API calls are done there. Also the calls to the toast notifications, and in the future the login system.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

NOTE: it is not needed to run a service to test the application, because internally, it uses a local fake API (It is configured to run in development mode)

### `npm test`

Launches the test runner in the interactive watch mode. Uses Jest.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


### `npm run cy:open`

Opens the Cypress interface. Also enables port 9222 for debugging.

### `npm run cy:e2e:run`

Runs the Cypress E2E tests in the console mode (no visual interface).

### `npm run e2e:open`

Runs the application in debug mode and opens the Cypress interface.

### `npm run e2e:run`

Runs the application in debug mode and runs the Cypress E2E tests.

### `npm run storybook`

Opens Storybook page.

### `npm run lint`

Lints the code, both with eslint and stylelint.

# 3rd party tools

## components visualization

- [storybook](https://storybook.js.org/): tool for developing UI components in isolation for React, Vue, Angular, and more. It is based on the atomic design principles.

## routing

- [React Router](https://reactrouter.com/web/guides/quick-start): routing for React.

## typescript

- [typescript](https://www.typescriptlang.org/): typed superset of Javascript that compiles to plain Javascript.

## debugging

- [mirage-js](https://miragejs.com/): fake local API, used when debugging the application, to have a working API but agnostic from APIs.

## testing

### unit and functional tests

- [Jest](https://jestjs.io/): testing tool.
- [ts-jest](https://github.com/kulshekhar/ts-jest): a typescript preprocessor for Jest.

### end-to-end tests

- [cypress](https://www.cypress.io/): library for end-to-end testing.

## app running

- [react-scripts](https://www.npmjs.com/package/react-scripts): scripts and configuration used by [Create React App](https://github.com/facebook/create-react-app)


## API calls

-  [axios](https://github.com/axios/axios): promise based HTTP client.
-  [axios-retry](https://github.com/softonic/axios-retry): helper library for Axios, that intercepts failer request and retries.
