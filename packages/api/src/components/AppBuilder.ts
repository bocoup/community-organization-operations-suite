/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import fastify, { FastifyInstance } from 'fastify'
import fastifyCors from 'fastify-cors'
import mercurius, { IResolvers, MercuriusContext } from 'mercurius'
import mercuriusAuth, { MercuriusAuthOptions } from 'mercurius-auth'
import { Authenticator } from './Authenticator'
import { Configuration } from './Configuration'
import { DatabaseConnector } from './DatabaseConnector'
import { ContactCollection, OrganizationCollection, UserCollection } from '~db'
import {
	orgAuthDirectiveConfig,
	renderIndex,
	getHealth,
	getLogger,
} from '~middleware'
import { resolvers } from '~resolvers'
import { AppContext } from '~types'

export class AppBuilder {
	#app: FastifyInstance
	#config: Configuration
	#authenticator: Authenticator
	#startupPromise: Promise<void>
	#dbConn: DatabaseConnector

	public constructor(config: Configuration) {
		this.#config = config
		this.#authenticator = new Authenticator(config)
		this.#dbConn = new DatabaseConnector(config)
		this.#app = fastify({ logger: getLogger(config) })
		this.#startupPromise = this.composeApplication()
	}

	private async composeApplication(): Promise<void> {
		await this.#dbConn.connect()
		const appContext = this.buildAppContext()

		// Compose the application
		this.#app.register(fastifyCors)
		this.configureIndex()
		this.configureHealth()
		this.configureGraphQL(appContext)
		this.configureOrgAuthDirective()
	}

	private configureIndex(): void {
		this.#app.get('/', async (req, res) => {
			res.type('text/html').code(200)
			return renderIndex(this.#config)
		})
	}

	private configureHealth(): void {
		this.#app.get('/health', async (req, res) => {
			res.type('application/json').code(200)
			return getHealth()
		})
	}

	private buildAppContext(): Partial<AppContext> {
		return {
			config: this.#config,
			collections: {
				users: new UserCollection(this.#dbConn.usersCollection),
				orgs: new OrganizationCollection(this.#dbConn.orgsCollection),
				contacts: new ContactCollection(this.#dbConn.contactsCollection),
			},
		}
	}

	private configureGraphQL(context: Partial<AppContext>): void {
		this.#app.register(mercurius, {
			schema: getSchema(),
			resolvers: resolvers as IResolvers<any, MercuriusContext>,
			graphiql: this.#config.graphiql,
			context: (req, res) => {
				// Note: other request-level contants can be weaved into here. This is a place
				// where the current user state is usually weaved into GraphQL applications
				return context
			},
		})
	}

	private configureOrgAuthDirective() {
		this.#app.register<MercuriusAuthOptions>(
			mercuriusAuth,
			orgAuthDirectiveConfig(this.#authenticator)
		)
	}

	public async build(): Promise<FastifyInstance> {
		await this.#startupPromise
		return this.#app
	}
}

function getSchema(): string {
	return fs.readFileSync(require.resolve('@greenlight/schema/schema.gql'), {
		encoding: 'utf-8',
	})
}
