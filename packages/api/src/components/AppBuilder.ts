/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import fs from 'fs'
import fastify, { FastifyInstance } from 'fastify'
import fastifyCors from 'fastify-cors'
import fastifyJWT from 'fastify-jwt'
import mercurius, { IResolvers, MercuriusContext } from 'mercurius'
import mercuriusAuth, { MercuriusAuthOptions } from 'mercurius-auth'
import { Authenticator } from './Authenticator'
import { Configuration } from './Configuration'
import {
	orgAuthDirectiveConfig,
	renderIndex,
	getHealth,
	getLogger,
	authDirectiveConfig,
} from '~middleware'
import { resolvers } from '~resolvers'
import { AppContext, AsyncProvider, BuiltAppContext } from '~types'

export class AppBuilder {
	#app: FastifyInstance | undefined
	#startupPromise: Promise<void>
	#appContext: BuiltAppContext | undefined

	public constructor(contextProvider: AsyncProvider<BuiltAppContext>) {
		this.#startupPromise = this.composeApplication(contextProvider)
	}

	private get app(): FastifyInstance {
		if (this.#app == null) {
			throw new Error('app has not been initialized')
		}
		return this.#app
	}

	private get appContext(): BuiltAppContext {
		if (this.#appContext == null) {
			throw new Error('appContext has not been initalized')
		}
		return this.#appContext
	}

	private get config(): Configuration {
		return this.appContext.config
	}

	private get authenticator(): Authenticator {
		return this.appContext.components.authenticator
	}

	private async composeApplication(
		contextProvider: AsyncProvider<BuiltAppContext>
	): Promise<void> {
		// Establish the Application Context first
		const appContext = await contextProvider.get()
		this.#appContext = appContext

		// Compose the Application
		this.#app = fastify({ logger: getLogger(this.config) })
		await this.#app.register(fastifyJWT, { secret: this.config.jwtTokenSecret })
		this.authenticator.registerJwt((this.#app as any).jwt)
		this.#app.register(fastifyCors)
		this.configureIndex()
		this.configureHealth()
		this.configureGraphQL(appContext)
		this.configureAuthDirectives()
	}

	private configureIndex(): void {
		this.app.get('/', async (req, res) => {
			res.type('text/html').code(200)
			return renderIndex(this.config)
		})
	}

	private configureHealth(): void {
		this.app.get('/health', async (req, res) => {
			res.type('application/json').code(200)
			return getHealth()
		})
	}

	private configureGraphQL(appContext: Partial<AppContext>): void {
		this.app.register(mercurius, {
			schema: getSchema(),
			resolvers: resolvers as IResolvers<any, MercuriusContext>,
			graphiql: this.config.graphiql,
			context: async (req, res) => {
				// Note: other request-level contants can be weaved into here. This is a place
				// where the current user state is usually weaved into GraphQL applications
				let user = null

				const authHeader: string = req.headers.authorization
				if (authHeader) {
					const bearerToken = this.authenticator.extractBearerToken(authHeader)
					user = await this.authenticator.getUser(bearerToken)
				}

				return { ...appContext, auth: { identity: user } }
			},
		})
	}

	private configureAuthDirectives() {
		this.app.register<MercuriusAuthOptions>(
			mercuriusAuth,
			orgAuthDirectiveConfig(this.authenticator)
		)
		this.app.register<MercuriusAuthOptions>(
			mercuriusAuth,
			authDirectiveConfig()
		)
	}

	public async build(): Promise<FastifyInstance> {
		await this.#startupPromise
		return this.app
	}
}

function getSchema(): string {
	return fs.readFileSync(require.resolve('@greenlight/schema/schema.gql'), {
		encoding: 'utf-8',
	})
}
