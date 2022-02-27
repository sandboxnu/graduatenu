# GraduateNU API V2

## Installation

```bash
npm install
```

## Running the app

1. Run `yarn dev:db:up` from the project root to run the database in docker. You can run `yarn dev:db:down` from the project root to take down the database when you're done.

2. Run `yarn dev` from within the api-v2 directory to run the server in watch mode.

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
