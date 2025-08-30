FROM node:20

WORKDIR /app

RUN mkdir -p ./bash

COPY app/. .

RUN npm install

CMD ["sh", "bash/init.sh"]

