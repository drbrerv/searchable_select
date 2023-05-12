#!/bin/bash

DEST=$1

if [ -z $DEST ]
then
    DEST=/var/www/html/js
fi

echo "install -m 0644 ./js/searchableSelect.js ${DEST}"
install -m 0644 ./js/searchableSelect.js $DEST
