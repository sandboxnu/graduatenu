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
RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY common/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000 80
CMD ["nginx", "-g", "daemon off;"]