/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import fastify, { FastifyInstance } from 'fastify'
import fastifyCors from 'fastify-cors'
import mercurius, { IResolvers, MercuriusContext } from 'mercurius'
import mercuriusAuth, { MercuriusAuthOptions } from 'mercurius-auth'
import { Db, MongoClient } from 'mongodb'
import { Authenticator } from './Authenticator'
import { Configuration } from './Configuration'
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
	#client: MongoClient

	public constructor(config: Configuration) {
		this.#config = config
		this.#authenticator = new Authenticator(config)
		this.#client = new MongoClient(this.#config.dbConnectionString)
		this.#app = fastify({ logger: getLogger(config) })
		this.#startupPromise = this.composeApplication()
	}

	private async composeApplication(): Promise<void> {
		const db = await this.connectToDatabase()
		const appContext = this.buildAppContext(db)

		// Compose the application
		this.#app.register(fastifyCors)
		this.configureIndex()
		this.configureHealth()
		this.configureGraphQL(appContext)
		this.configureOrgAuthDirective()
	}

	private connectToDatabase(): Promise<Db> {
		const client = this.#client
		const dbName = this.#config.dbDatabase
		return new Promise<Db>((resolve, reject) => {
			client.connect((err) => {
				if (err) {
					reject(err)
				} else {
					resolve(client.db(dbName))
				}
			})
		})
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

	private buildAppContext(db: Db): Partial<AppContext> {
		const usersCollection = db.collection(this.#config.dbUsersCollection)
		const orgsCollection = db.collection(this.#config.dbOrganizationsCollection)
		const contactsCollection = db.collection(this.#config.dbContactsCollection)
		return {
			collections: {
				users: new UserCollection(this.#config, usersCollection),
				orgs: new OrganizationCollection(this.#config, orgsCollection),
				contacts: new ContactCollection(this.#config, contactsCollection),
			},
		}
	}

	private configureGraphQL(context: Partial<AppContext>): void {
		const schema = getSchema()

		this.#app.register(mercurius, {
			schema,
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
