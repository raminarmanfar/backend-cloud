FROM node:10.10.0-jessie

RUN apt-get -y update && apt-get -y install vim

WORKDIR /usr/src/app

COPY . .
RUN npm run build

EXPOSE 5000

CMD [ "npm", "run", "node" ]