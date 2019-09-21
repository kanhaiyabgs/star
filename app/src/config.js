import Firebase from 'firebase';

// this thing was really causing the issue. Without this statement firebase.function was giving undefined error
import 'firebase/functions';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBSIebl070TG5yUJ2T1pWSf7lZUqkaoBcc",
    authDomain: "saystar-12ea3.firebaseapp.com",
    databaseURL: "https://saystar-12ea3.firebaseio.com",
    projectId: "saystar-12ea3",
    storageBucket: "gs://saystar-12ea3.appspot.com",
    messagingSenderId: "34376917247",
    appId: "1:34376917247:web:9bfb9c4486b4506e"
  };
  // Initialize Firebase
let app =  Firebase.initializeApp(firebaseConfig);

const database = app.database();
const auth = app.auth();
const storage = app.storage();
const functions = app.functions();

export {app, database, auth, storage, functions};