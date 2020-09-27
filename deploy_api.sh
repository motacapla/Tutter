#!/bin/sh

rm -f /Users/motacapla/Coding/Web/Tutter/api_server/flask/v1/image/*
scp -r /Users/motacapla/Coding/Web/Tutter/api_server/flask/* AWS:/home/ubuntu/tutter/api_server/flask/ 
ssh AWS sudo systemctl restart nginx.service 
ssh AWS sudo systemctl restart tutter-uwsgi.service
