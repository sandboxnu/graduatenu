# GraduateNU

GraduateNU aims to empower Northeastern students to customize their plan of study through an intuitive and flexible interface shaped by student feedback.

## Running the application locally

First make sure you run the dev postgres database using `yarn dev:db:up`. Run `yarn dev:db:down` when you're done.

Then run the new version of the application by running `yarn dev:v2` at the root of the project. This starts up a NestJS server + a NextJS frontend + a Proxy. The proxy listens on port [3002](http://localhost:3002/), forwards /api requests to the NestJS server running on port 3001, and all other requests to the frontend running on port 3000.

Visit [http://localhost:3002](http://localhost:3002/) to view the app.

To run the two seperately, visit the frontend and api-v2 packages(sub directories of the monorepo).

## Running the production like app in docker

We use docker and prod builds for our production app. It is a good idea to test out whether the app builds and runs the way it would in production.

NOTE: We don't support running the full stack production app locally yet. It can be done through NGIX, I am lazy.

- To run just the frontend
  - `yarn frontend:docker:build` and `yarn frontend:docker:run`.
  - Visit the containerized frontend at port [4000](http://localhost:4000).
- To run just the backend
  - `yarn backend:docker:build` and `yarn backend:docker:run`.
  - Visit the containerized API at port [4001](http://localhost:4001).
  - To stop the container run `yarn backend:docker:down`.
  - To debug, `use docker compose --verbose` for the build and run commands depending on which one is failing.

## Monorepo

This is a monorepo powered by [Yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). The different components of the GraduateNU application exist within their own workspace directory in `/packages`.

You can run a command for a specific workspace from the root directory via `yarn packages/<package> <command>`, where `<command>` can be a yarn command like `add typescript`, a custom script like `dev`, or a bin script like `tsc`.

Example: `yarn packages/frontend lint`

The workspaces within this monorepo are:

1. **frontend-v2**: A Next.js web UI. It is what users see when they visit our application.

2. **api-v2**: A Nest.js API reponsible for storing and managing Graduate's data. Our frontend leans on our api for data related services.

3. **api-client:** A typescript client responsible for providing a streamlined and typed interface to interact with our API. The frontend uses this client to send request to our API.

4. **scrapers-v2**: A typescript web scraper repsonsible for scraping [Northeastern's course catalog website](https://catalog.northeastern.edu/undergraduate/) for the latest graduation requirements for majors at Northeastern.

5. **common**: All common types and logic used by our frontend, api and scrapers.
