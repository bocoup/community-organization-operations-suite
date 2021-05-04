/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import config from 'config'
import express, { Express } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import next from 'next'

async function bootstrap(): Promise<void> {
	const port = config.get<number>('server.port')
	const dev = config.get<boolean>('server.devMode')
	const apiUrl = config.get<string>('api.url')
	console.log(`starting webapp; devmode? ${dev}; apiUrl=${apiUrl}; port=${port}`)

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
	server.listen(port, () => {
		console.log(`🚀 greenlight app ready on http://localhost:${port}`)
	})
}

bootstrap().catch(err => {
	console.log('error starting server', err)
})
