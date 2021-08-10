/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import conf from 'config'
import { Configuration } from './Configuration'

const config = new Configuration(conf)

const installEvent: EventListener = event => {
	console.log('Service Worker installed...', event)
	console.log('Config key in service-worker', config)
}
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', installEvent)
