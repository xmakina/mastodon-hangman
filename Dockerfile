FROM node:16.15.1-alpine

WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY ./src ./src
CMD ["node", "./src/bot.js"]