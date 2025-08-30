FROM debian:bullseye

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install nginx -y

COPY ./nginx/nginx.conf /etc/nginx/

CMD ["nginx", "-g", "daemon off;"]
