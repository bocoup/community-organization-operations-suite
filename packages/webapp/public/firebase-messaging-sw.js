/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.9.1/firebase-messaging.js');

// Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyBB7kZZvJXQrWSeqFJQn-ZEGeAuAF5l3c0",
	authDomain: "project-resolve-test.firebaseapp.com",
	projectId: "project-resolve-test",
	storageBucket: "project-resolve-test.appspot.com",
	messagingSenderId: "894244672689",
	appId: "1:894244672689:web:40d88d5b7494dc55ab3e90"
};

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Receieve background messages from server
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // // Customize notification here
  // const notificationTitle = 'Background Message Title';
  // const notificationOptions = {
  //   body: 'Background Message body.',
  //   icon: '/firebase-logo.png'
  // };

  // self.registration.showNotification(notificationTitle,
  //   notificationOptions);
});

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', event => {
	console.log('Service Worker installed...', event)
});

// Receive messages from client app
self.addEventListener('message', event => {
  // event is an ExtendableMessageEvent object
	if(event?.data?.message){ 
		console.log('Message in service worker', event?.data?.message);
	}

  event.source.postMessage("Hi client");
});