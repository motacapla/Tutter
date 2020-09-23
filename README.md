# Tutter
![alt text](https://github.com/motacapla/Tutter/blob/master/react/public/Tutter-logo-blue.png?raw=true)

http://tutter.org/

Authenticate with twitter account, convert image and tweet with it.


## Requirements
### Create api_server/flask/config.py
```
CONSUMER_KEY = '<twitter consumer key here>'
CONSUMER_SECRET = '<twitter consumer secret here>'
```

### Create react/src/components/FirebaseConfig.js
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

### Create react/src/components/Config.js
Please specify the below url to communicate with api server
```
export const API_SERVER_HOST_URL = 'http://54.178.4.190:5000';

export default API_SERVER_HOST_URL;
```
