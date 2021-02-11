FROM node:14

WORKDIR /pathway

COPY package.json ./
RUN npm install

COPY . /pathway