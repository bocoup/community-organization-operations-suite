/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Next App Server-Side Code
 */
import { bootstrap } from './server'

bootstrap().catch(err => {
	console.log('error starting server', err)
})
