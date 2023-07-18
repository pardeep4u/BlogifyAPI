FROM node

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3050

CMD [ "npm", "start" ]