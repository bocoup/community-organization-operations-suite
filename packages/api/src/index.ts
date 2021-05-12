/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import mercurius from 'mercurius'
import { Configuration } from './Configuration'
import { resolvers } from './resolvers'

function startup() {
	try {
		const config = new Configuration()
		const schema = getSchema()
		const app = Fastify()
		app.register(fastifyCors, {})
		app.register(mercurius, {
			schema,
			resolvers,
			graphiql: config.graphiql,
		})
		app.get('/', (req, res) => {
			res.send({
				data: {
					status: 'ok',
				},
				links: {
					playground: '/playground',
				},
			})
		})

		console.log('starting app...')
		const port = 3030
		console.log('initializing server...')
		app.listen(port, () =>
			console.log(`🚀 services app listening on port ${port}`)
		)
	} catch (err) {
		console.error('error starting app', err)
		throw err
	}
}

startup()

function getSchema(): string {
	return fs.readFileSync(require.resolve('@greenlight/schema/schema.gql'), {
		encoding: 'utf-8',
	})
}
