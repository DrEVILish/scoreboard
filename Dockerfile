FROM node:6.2.1
RUN mkdir -p /usr/src/app && cd /usr/src/app && git clone https://github.com/DrEVILish/scoreboard
WORKDIR /usr/src/app/scoreboard
RUN npm install
EXPOSE 3000
ADD init/ /etc/my_init.d/
ADD services/ /etc/service/
RUN chmod -v +x /etc/service/*/run
RUN chmod -v +x /etc/my_init.d/*.sh