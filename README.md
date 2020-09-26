# Tutter
http://tutter.org/
![alt text](https://github.com/motacapla/Tutter/blob/master/react/public/Tutter-logo-blue.png?raw=true)


Tutter is a web application to convert fish photo.

User can easily tweet with extracted image.

## Requirements

### Backend
```
$ pip -t requirements.txt
```
#### Create api/flask/config.py
Twitter API key and secret are needed
```
CONSUMER_KEY = '<twitter consumer key here>'
CONSUMER_SECRET = '<twitter consumer secret here>'
```
### Frontend
```
$ npm install -g firebase-tools
$ npm install react-bootstrap bootstrap
```
#### Create react/src/components/FirebaseConfig.js
Authentication is based on firebase SDK
```
import firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: '<firebase api key>',
  authDomain: '<firebase project id>.firebaseapp.com',
  projectId: '<firebase project id>'  
});

export const provider = new firebase.auth.TwitterAuthProvider();
export default firebase;
```

#### Create react/src/components/Config.js
Please specify the below url to communicate with api server
```
export const API_SERVER_HOST_URL = 'http://tutter.org:5000';

export default API_SERVER_HOST_URL;
```
