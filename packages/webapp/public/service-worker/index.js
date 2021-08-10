/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', event => {
	console.log('Service Worker installed...', event)
});

self.addEventListener('message', event => {
  // event is an ExtendableMessageEvent object
	if(event?.data?.message){ 
		console.log('Message in service worker', event?.data?.message);
	}
	
  event.source.postMessage("Hi client");
});