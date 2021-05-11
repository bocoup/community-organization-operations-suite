/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Next App Server-Side Code
 */
import type { IConfig } from 'config'
import { config as configDotEnv } from 'dotenv'
import express, { Express } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
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

function createConfig(): Configuration {
	// load dotenv first before initializing config stack
	configDotEnv()
	// eslint-disable-next-line
	return new Configuration(require('config') as IConfig)
}

async function createServer(config: Configuration): Promise<Express> {
	const dev = config.isDevMode
	const apiUrl = config.apiUrl
	console.log(`launching webapp; devmode? ${dev}; apiUrl=${apiUrl}`)

	const app = next({ dev })
	const handle = app.getRequestHandler()

	/**
	 * Custom server
	 * https://nextjs.org/docs/advanced-features/custom-server
	 *
	 * proxy for api
	 * pass off to next for everything else
	 */
	await app.prepare()

	const server: Express = express()
	server.use(
		'/api',
		createProxyMiddleware({
			target: apiUrl,
			pathRewrite: {
				'^/api': '/api'
			},
			changeOrigin: true
		}) as any
	)
	server.all('*', (req, res) => handle(req, res))
	return server
}

async function bootstrap() {
	const config = createConfig()
	const port = config.port
	const server = await createServer(config)
	server.listen(port, () => {
		console.log(`🚀 greenlight app ready on http://localhost:${port}`)
	})
}

bootstrap().catch(err => {
	console.log('error starting server', err)
})
