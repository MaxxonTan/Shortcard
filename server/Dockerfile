FROM node:18-alpine3.17

ENV NODE_ENV=development

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]