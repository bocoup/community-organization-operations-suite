/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createApp } from './app'

function startup() {
	try {
		console.log('starting app...')
		const app = createApp()
		const port = 3030
		console.log('initializing server...')
		app.listen(port, () => console.log(`🚀 app listening on port ${port}`))
	} catch (err) {
		console.error('error starting app', err)
		throw err
	}
}

startup()
