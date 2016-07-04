#!/bin/bash

[[ ! -d /usr/src/app/scoreboard/.git ]] && git clone \
https://github.com/DrEVILish/scoreboard /usr/src/app/scoreboard

chown -R abc:abc /usr/src/app/scoreboard

# opt out for autoupdates
[ "$ADVANCED_DISABLEUPDATES" ] && exit 0

cd /usr/src/app/scoreboard
git pull
chown -R abc:abc /usr/src/app/scoreboard