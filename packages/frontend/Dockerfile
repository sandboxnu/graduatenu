FROM node:14-alpine as build

WORKDIR /app

# package.json of root and of needed packages
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY yarn.lock .
COPY babel.config.js .
COPY package.json .
COPY packages/api/package.json packages/api/package.json
COPY packages/frontend/package.json packages/frontend/package.json
COPY packages/frontend-v2/package.json packages/frontend-v2/package.json
COPY packages/common/package.json packages/common/package.json
COPY packages/scrapers/package.json packages/scrapers/package.json
COPY packages/api-v2/package.json packages/api-v2/package.json

# Install at root level
RUN yarn install --immutable

# Get src files
COPY packages/frontend packages/frontend
COPY packages/common packages/common

ARG NODE_OPTIONS=--max_old_space_size=4096

# Build common package and frontend for the browser
ENV NODE_ENV production
RUN yarn packages/common build:browser
RUN yarn packages/frontend build

FROM nginx:1.16.0-alpine

COPY --from=build /app/packages/frontend/build /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]