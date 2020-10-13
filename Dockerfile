FROM node:8
COPY package.json /app/package.json
RUN yarn install
COPY . /app
WORKDIR /app
EXPOSE 8000/tcp
CMD yarn start
