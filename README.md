# YAT (Yes, Another Todolist)

Yat is a complete todolist application React.js + Node.js (`client` and `server` folders).

## Technologies

### Frontend

- React.js.
- Typescript.
- Vite.
- Vitest.
- Cypress.
- Storybook.
- SASS.
- Redux + Redux Saga.
- ESLint.
- Mirage.js.
- JsDoc.

### Backend

- Node.js.
- Typescript.
- Express.
- MongoDB.

## How to run it

- Specify your MongoDB connection in the backend (.env file).
- Run this command:
  `npm run runall`

  This command runs frontend and backend at the same time (A fronend reload might be needed if no data is displayed).

## Available Scripts

### Frontend

In the `client` directory, you can run:

#### `npm start`

Runs the app in the development mode, using `Vite`.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

NOTE: it is not needed to run a service to test the application, because internally, it uses a local fake API (it is configured to run in development mode)

#### `npm run test`

Launches the test runner. Uses `Vitest`.

#### `npm run coverage`

Launches the test runner, displays the test coverage and generates some extra information in `coverage` folder.

#### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

#### `npm run cy:open`

Opens the Cypress interface. Also enables port 9222 for debugging.

#### `npm run cy:e2e:run`

Runs the Cypress E2E tests in the console mode (no visual interface).

#### `npm run e2e:open`

Runs the application in debug mode and opens the Cypress interface.

#### `npm run e2e:run`

Runs the application in debug mode and runs the Cypress E2E tests.

#### `npm run storybook`

Opens Storybook page.

#### `npm run lint`

Lints the code, both with eslint and stylelint.

### Backend

In the `server` directory, you can run:

#### `start`

To start the Node.js, running (by default) in [http://localhost:3001](http://localhost:3001).

## Architecture

### Local Fake API

The frontend application uses [mirage-js](https://miragejs.com/) to work with an in-memory local fake API server (but only for test purposes, as data won't persist). This is an efficient way of working with frontend applications, being agnostic from real (testing or production) API's. So you can run the frontend application alone, setting this in .env file: `VITE_APP_FAKE_API = true`.

### Atomic Design Principles

The frontend project is built based in the [atomic design principles](https://bradfrost.com/blog/post/atomic-web-design/). The components are divided into different types (atoms, particles, molecules, etc). Each component is atomic, with no dependencies (except the components connected to Redux). Each component can be visualized and manually tested with Storybook.

### Redux as the brain

Most of the business logic is done in Redux. Working in this way, allows to the component to be lighweight, and easier to test and to modify.

The side effects related to Redux, is in the middleware, managed by Redux Saga. That means that for example the API calls are done there.

Is Redux needed for this project? Not really ;).

## 3rd party tools

### backend

- [node.js](https://nodejs.org/): javascript runtime environment.
- [express](https://expressjs.com/): web framework for Node.js.

#### database

- [mongodb](https://www.mongodb.com/): NoSQL database.

### frontend

- [react.js](https://reactjs.org/): javascript library for building user interfaces.

### build tool

- [vite](https://vitejs.dev/).

#### component visualization

- [storybook](https://storybook.js.org/): tool for developing UI components in isolation. It is based on the atomic design principles.

#### routing

- [React Router](https://reactrouter.com/web/guides/quick-start): routing for React.

#### typescript

- [typescript](https://www.typescriptlang.org/): typed superset of Javascript that compiles to plain Javascript.

#### debugging

- [mirage-js](https://miragejs.com/): fake local API, used when debugging the application, to have a working API but agnostic from APIs.

#### testing

##### unit and functional tests

- [vitest](https://vitest.dev/): testing tool.

##### end-to-end tests

- [cypress](https://www.cypress.io/): library for end-to-end testing.

#### API calls

-  [axios](https://github.com/axios/axios): promise based HTTP client.
-  [axios-retry](https://github.com/softonic/axios-retry): helper library for Axios, that intercepts failer request and retries.




