FROM nginx:1.16.0-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY common/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]