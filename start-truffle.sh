#!/bin/bash
/wait-for-ganache.sh
node client/exportContract.js &
lite-server --config bs-config.json
