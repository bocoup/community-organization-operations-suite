/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import mercurius from 'mercurius'
import pino from 'pino'
import { Configuration } from './Configuration'
import { getSchema } from './getSchema'
import { resolvers } from './resolvers'

function startup() {
	try {
		console.log(`preparing server`)
		const config = new Configuration()
		const schema = getSchema()
		const logger = pino({})
		const app = Fastify({
			logger,
		})
		app.register(fastifyCors, {})
		app.register(mercurius, {
			schema,
			resolvers,
			graphiql: config.graphiql,
		})
		app.get('/health', async (req, res) => {
			res.type('application/json').code(200)
			return {
				status: 'ok',
			}
		})
		app.get('/', async (req, res) => {
			res.type('text/html').code(200)
			return `
<body>
<h1>Greenlight API</h1>
<ul>
	<li><a href="/health">Health</a></li>
	${config.graphiql ? '<li><a href="/playground">Playground</a></li>' : ''}
</ul>
</body>
			`
		})

		const { port, host } = config

		console.log('starting server...')
		app.listen(port, host, (err, address) => {
			if (err) {
				console.error('error starting api', err)
				throw err
			} else {
				console.log(
					`🚀 services app listening at "${address}", environment="${process.env.NODE_ENV}"`
				)
			}
		})
	} catch (err) {
		console.error('error starting app', err)
		throw err
	}
}

process.on('unhandledRejection', (reason, promise) => {
	console.log('caught unhandled rejection', reason)
})
startup()
