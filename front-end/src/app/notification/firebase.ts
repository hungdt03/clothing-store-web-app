import { type FirebaseOptions, initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import firebaseCredential from "./credential.json"; 
import deviceTokenService from "../../services/device-token-service";
import { getAccessToken } from "../../utils/auth";

const config: FirebaseOptions = {
    apiKey: firebaseCredential.apiKey,
    authDomain: firebaseCredential.authDomain,
    projectId: firebaseCredential.projectId,
    storageBucket: firebaseCredential.storageBucket,
    messagingSenderId: firebaseCredential.messagingSenderId,
    appId: firebaseCredential.appId,
    measurementId: firebaseCredential.measurementId
};

const app = initializeApp(config);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
    if ("Notification" in window) {
        try {
            // requesting notification permission
            const permission = await (
                Notification || window.Notification
            ).requestPermission();

            if (permission) {
                console.info("Notification permission granted.");
            }
        } catch (error) {
            console.error("Unable to get permission to notify.", error);
        }
    }
};

export const getFCMToken = async () => {
    let token: string | null = null;

    if ("serviceWorker" in navigator) {
        try {
            // installing firebase service worker and try getting the token
            token = await getToken(messaging, {
                vapidKey: 'BGNdeNSPdOJMsrXrNDUBZkPg8tBE3vy4elb8fMtYYe2Yosz8XshndVBLZBWE7x1PG-G3ohuZ9r_9gTfC-DrLodU'
            });

            localStorage.setItem("fcmToken", JSON.stringify(token));
            const accessToken = getAccessToken();
            if(accessToken) {
                await deviceTokenService.saveToken(token);
            }   

            console.info("Got FCM token:", token);
        } catch (error) {
            console.error("Unable to get FCM token.", error);
        }
    }

    return token;
};

export const initializeFCM = async () => {
    await Promise.all([requestNotificationPermission(), getFCMToken()]);
};