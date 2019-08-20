FROM node:12.0

RUN apt update
RUN apt install -y zlibc
RUN apt install -y ffmpeg

WORKDIR /app

COPY . /app

RUN npm install

CMD ["nodemon", "index.js"]