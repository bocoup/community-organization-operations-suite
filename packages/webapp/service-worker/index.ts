/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const installEvent: EventListener = event => {
	console.log('Service Worker installed 🤙', event)
}

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', installEvent)

export {}
