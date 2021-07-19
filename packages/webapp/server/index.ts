/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import path from 'path'
import fs from 'fs'
import conf from 'config'
import express from 'express'
import { Configuration } from './Configuration'
import { getNextHandler } from './getNextHandler'

export async function bootstrap(): Promise<void> {
	try {
		const config = new Configuration(conf)

		// write out the ssl token file
		const godaddyFile = path.join(__dirname, 'godaddy.html')
		fs.writeFileSync(godaddyFile, `${config.sslToken}\n`, { encoding: 'utf8' })

		const server = express()
		const handle = await getNextHandler(config)
		server.all('*', (req, res) => {
			if (req.path.endsWith('.well-known/pki-validation/godaddy.html')) {
				res.download(godaddyFile, 'godaddy.html')
			} else {
				handle(req, res)
			}
		})
		const port = config.port
		const configEnvironment = process.env.NODE_CONFIG_ENV || process.env.NODE_ENV || 'default'
		const mode = config.isDevMode ? 'development' : 'production'
		server.listen(port, () => {
			console.log(
				`🚀 greenlight app ready, mode=${mode} configEnv=${configEnvironment} on http://localhost:${port}`
			)
		})
		console.log('server finished')
	} catch (err) {
		console.log('error starting server (in bootstrap)', err)
		throw err
	}
}
