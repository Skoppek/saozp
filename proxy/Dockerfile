FROM nginx:alpine

WORKDIR /etc/nginx
COPY ./nginx.conf ./conf.d/default.conf
EXPOSE 5173
ENTRYPOINT [ "nginx" ]
CMD [ "-g", "daemon off;" ]