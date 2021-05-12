/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Next App Server-Side Code
 */
import { createServer } from 'http'
import conf, { IConfig } from 'config'
import next from 'next'

class Configuration {
	public constructor(private config: IConfig) {}

	public get isDevMode(): boolean {
		return this.config.get<boolean>('server.devMode')
	}

	public get port(): number {
		return this.config.get<number>('server.port')
	}

	public get apiUrl(): string {
		return this.config.get<string>('api.url')
	}
}

function bootstrap(): Promise<void> {
	try {
		const config = new Configuration(conf)
		const dev = config.isDevMode
		const apiUrl = config.apiUrl
		const port = config.port
		console.log(`launching webapp; devmode? ${dev}; apiUrl=${apiUrl}`)

		/**
		 * Custom server
		 * https://nextjs.org/docs/advanced-features/custom-server
		 *
		 * proxy for api
		 * pass off to next for everything else
		 */
		const app = next({ dev })
		const handle = app.getRequestHandler()
		return app
			.prepare()
			.then(() =>
				createServer((req, res) => {
					console.log('handle ' + req.method + ' ' + req.url)
					handle(req, res)
				}).listen(port, () => {
					console.log(`🚀 greenlight app ready on http://localhost:${port}`)
				})
			)
			.then(() => {
				console.log('server finished')
			})
	} catch (err) {
		console.log('error starting server (in bootstrap)', err)
		throw err
	}
}

bootstrap().catch(err => {
	console.log('error starting server', err)
})
