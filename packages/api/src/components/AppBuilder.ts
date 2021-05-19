/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import fastify, { FastifyInstance } from 'fastify'
import fastifyCors from 'fastify-cors'
import mercurius from 'mercurius'
import mercuriusAuth, { MercuriusAuthOptions } from 'mercurius-auth'
import pino from 'pino'
import { Authenticator } from './Authenticator'
import { Configuration } from './Configuration'
import { orgAuthDirectiveConfig, renderIndex, getHealth } from '~middleware'
import { resolvers } from '~resolvers'

export class AppBuilder {
	#app: FastifyInstance

	public constructor(config: Configuration, authenticator: Authenticator) {
		this.#app = fastify({ logger: pino({}) }).register(fastifyCors)
		//
		// Index Endpoint
		//
		this.#app.get('/', async (req, res) => {
			res.type('text/html').code(200)
			return renderIndex(config)
		})

		//
		// Health Endpoint
		//
		this.#app.get('/health', async (req, res) => {
			res.type('application/json').code(200)
			return getHealth()
		})

		// GraphQL Schema
		const schema = getSchema()
		this.#app.register(mercurius, {
			schema,
			resolvers,
			graphiql: config.graphiql,
		})

		//
		// orgAuth Directive
		//
		this.#app.register<MercuriusAuthOptions>(
			mercuriusAuth,
			orgAuthDirectiveConfig(authenticator)
		)
	}

	public get app(): FastifyInstance {
		return this.#app
	}
}

function getSchema(): string {
	return fs.readFileSync(require.resolve('@greenlight/schema/schema.gql'), {
		encoding: 'utf-8',
	})
}
