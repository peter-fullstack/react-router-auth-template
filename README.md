<p align="center">
  <h1 align="center">React JS Authentication Boilerplate</h1>
</p>

<p align="center">
  <span>Bob</span>
</p>

## Summary

- [About](#about)
- [Built using](#built-using)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing dependencies](#installing-dependencies)
- [Project setup](#project-setup)
  - [Compiles and hot-reloads for development](#compiles-and-hot-reloads-for-development)
  - [Compiles and minifies for production](#compiles-and-minifies-for-production)
  - [Lints and fixes files](#lints-and-fixes-files)
  - [Run your unit tests](#run-your-unit-tests)
- [Test users](#test-users)
  - [Administrator](#administrator)
  - [Client](#client)
- [Route types](#route-types)
  - [Public route](#public-route)
  - [Private route](#private-route)
  - [Hybrid route](#hybrid-route)
- [Control visibility of components](#control-visibility-of-components)

## About

This project is a modified version of this GitHub repo here - https://github.com/ederssouza/reactjs-auth-boilerplate
Full credit to the contributors on this project it has a good folder setup and use of React Router make sense and offer flexibilty across the different layers of the application.
Using Reacts Context Api to create a golbal Auth Provider is an elegant solution and the is used to demonstract Protected Routes.


## Built using

- [React JS](https://reactjs.org): JavaScript library
- [TypeScript](https://www.typescriptlang.org): JavaScript With Syntax For Types
- [Jest](https://jestjs.io): JavaScript Testing Framework
- [React Testing Library](https://testing-library.com): Testing utilities

## Getting started

### Prerequisites

You need to install on your machine [Node.js](https://nodejs.org) or [Yarn](https://yarnpkg.com).

### Installing dependencies

```bash
npm install
# or
yarn install
```

## Project setup

### Compiles and hot-reloads for development

```bash
# start app open development mode
yarn start
# or
npm run start
```

### Compiles and minifies for production

```bash
yarn build
# or
npm run build
```

### Lints and fixes files
```bash
# show errors
yarn lint
# or
npm run lint

# fix errors
yarn lint:fix
# or
npm run lint:fix
```

### Run your unit tests

```bash
# run tests
yarn test
# or
npm run test

# run tests on watch mode
yarn test:watch
# or
npm run test:watch

# run tests on coverage mode
yarn test:coverage
# or
npm run test:coverage

# run tests on coverage with watch mode
yarn test:coverage:watch
# or
npm run test:coverage:watch
```

## Test users

The app is integrated with the [node-api-refresh-token.cyclic.app](https://node-api-refresh-token.cyclic.app) API, configured in the `.env` file. There are two users with different accesses so that the tests can be performed:

### Administrator

- **Email**: admin@site.com
- **Password**: password@123
- **Permissions**: `users.list`, `users.create`, `metrics.list`

### Client

- **Email**: client@site.com
- **Password**: password@123
- **Permissions**: `metrics.list`

## Route types

The route components are based on `<Route />` component of [react-router-dom](https://reactrouter.com/web/guides/quick-start) and receive same props.

### Public route

The route can only be accessed if a user is not authenticated. If accessed after authentication, the user will be redirected `/` route.

```tsx
import { Routes } from 'react-router-dom'
import { PublicRoute } from 'src/router/PublicRoute'

const SampleComponent = () => <div>Sample component</div>

export const Router = () => (
  <Routes>
    <PublicRoute
      path="/login"
      component={SampleComponent}
    />
  </Routes>
)
```

### Private route

The route can only be accessed if a user is authenticated. Use permission props (returned by the API) to access the control.

```tsx
import { Routes } from 'react-router-dom'
import { PrivateRoute } from 'src/router/PrivateRoute'

const SampleComponent = () => <div>Sample component</div>

export const Router = () => (
  <Routes>
    {/*
      allow route access if the user has the permissions
      `users.list` and `users.create`
    */}
    <PrivateRoute
      path="/users"
      component={SampleComponent}
      permissions={['users.list', 'users.create']}
    />
  </Routes>
)
```

### Hybrid route

The route can be accessed if a user is authenticated or not. Use `Route` component.

```tsx
import { Route, Routes } from 'react-router-dom'

const SampleComponent = () => <div>Sample component</div>

export const Router = () => (
  <Routes>
    <Route path="/contact" element={<SampleComponent />} />
  </Routes>
)
```

## Control visibility of components

Use the `CanAccess` component and pass `permissions` props to control the visibility of a component.

```tsx
import { CanAccess } from 'src/components'

export function NavBar () {
  return (
    <>
      {/*
        the component is shown if the user has the permissions
        `users.list` and `metrics.list`
      */}
      <CanAccess permissions={['users.list', 'metrics.list']}>
        {/* YOUR COMPONENT HERE */}
      </CanAccess>
    </>
  )
}
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning


Develop by Eder Sampaio 👋 &nbsp;[See my linkedin](https://www.linkedin.com/in/ederssouza).
