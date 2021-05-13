/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import express, { Express } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { Configuration } from './Configuration'

export function createServer(config: Configuration): Express {
	const server = express()
	server.use(
		'/api',
		createProxyMiddleware({
			target: config.apiUrl,
			pathRewrite: {
				'^/api': '/'
			},
			changeOrigin: true
		}) as any
	)
	return server
}
