// Here I am using Firebase version 10.12.3, 
// you can use Firebase version 10.12.3 and above, 
// because the Firebase legacy API has been turned off as of July 20 2024,
// see https://firebase.google.com/docs/cloud- messaging/migrate-v1
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.3/firebase-app-compat.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.3/firebase-messaging-compat.min.js");

firebase.initializeApp({
    apiKey: "AIzaSyA0YLdA1wKyWZxvUF56fLNgP-5Ucv8ZfqU",
    authDomain: "clothingstorewebapp.firebaseapp.com",
    projectId: "clothingstorewebapp",
    storageBucket: "clothingstorewebapp.appspot.com",
    messagingSenderId: "457033629133",
    appId: "1:457033629133:web:f7b48cc0be4d3e38f51884",
    measurementId: "G-Z67870D5JV"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (message) => {
    console.log("firebase-messaging-sw.js: Received background message ", message);

    self?.registration?.showNotification(message?.data?.title || "Notification Title", {
        icon: message?.data?.icon,
        badge: message?.data?.badge,
        body: message?.data?.body,
    })

    console.log('Show đi bro')
})