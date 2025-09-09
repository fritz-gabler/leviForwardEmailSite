FROM node:20

WORKDIR /app

RUN \
    mkdir -p ./frontend && \
    mkdir -p ./bash 

COPY frontend/. ./frontend/
COPY app/. ./

RUN npm install

CMD ["sh", "bash/init.sh"]

