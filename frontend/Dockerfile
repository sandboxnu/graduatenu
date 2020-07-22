# build environment
FROM node:12-alpine as build
WORKDIR /app
COPY frontend/package.json /app/package.json
COPY common /common
RUN yarn install 
COPY frontend/src /app/src
COPY frontend/public /app/public
COPY frontend/tsconfig.json /app/tsconfig.json
RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]