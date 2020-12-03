# build environment
FROM node:12-alpine as build
WORKDIR /app
COPY frontend/package.json /app/package.json
COPY frontend/config-overrides.js /app/config-overrides.js
COPY common /common
RUN yarn install 
COPY frontend/src /app/src
COPY frontend/public /app/public
COPY frontend/tsconfig.json /app/tsconfig.json
ARG NODE_OPTIONS=--max_old_space_size=4096
RUN yarn build

FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]