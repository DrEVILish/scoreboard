FROM node:6.2.1
RUN mkdir -p /usr/src/app && cd /usr/src/app && git clone https://github.com/DrEVILish/scoreboard
WORKDIR /usr/src/app/scoreboard
RUN npm install
EXPOSE 8080
CMD ['npm','start','--production']