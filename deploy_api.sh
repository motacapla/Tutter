#!/bin/sh

rm -f /Users/motacapla/Coding/Web/Tutter/api/flask/uploads/*
scp -r /Users/motacapla/Coding/Web/Tutter/api/flask/* AWS:/home/ubuntu/tutter/api/flask/ 
ssh AWS sudo systemctl restart nginx.service 
ssh AWS sudo systemctl restart tutter-uwsgi.service
