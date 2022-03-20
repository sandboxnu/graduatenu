FROM node:14-alpine as build

WORKDIR /

# package.json of root and of needed packages
COPY package.json .
COPY yarn.lock .
COPY babel.config.js .
COPY packages/frontend/package.json packages/frontend/package.json
COPY packages/common/package.json packages/common/package.json

# Install at root level
RUN yarn install --pure-lockfile --non-interactive

# Get src files
COPY packages/frontend packages/frontend
COPY packages/common packages/common

ARG NODE_OPTIONS=--max_old_space_size=4096
RUN yarn workspaces run build

ENV NODE_ENV production

WORKDIR /packages/frontend

FROM nginx:1.16.0-alpine
COPY --from=build packages/frontend/build /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]