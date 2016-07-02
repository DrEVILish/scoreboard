FROM node:6.2.1
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm intall -g npm@3
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
CMD ["npm","start"]
