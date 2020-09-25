#!/bin/sh
cd react/
npm run build
ssh AWS rm -rf /home/ubuntu/tutter/build/
scp -r build/ AWS:/home/ubuntu/tutter/build/
