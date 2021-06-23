/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Authenticator } from './Authenticator'
import { Configuration } from './Configuration'
import { DatabaseConnector } from './DatabaseConnector'
import {
	ContactCollection,
	OrganizationCollection,
	UserCollection,
	UserTokenCollection,
	EngagementCollection
} from '~db'
import { PubSub } from 'apollo-server'
import { AsyncProvider, BuiltAppContext } from '~types'
import nodemailer from 'nodemailer'

export class AppContextProvider implements AsyncProvider<BuiltAppContext> {
	#config: Configuration

	public constructor(config: Configuration) {
		this.#config = config
	}

	public async get(): Promise<BuiltAppContext> {
		const config = this.#config
		const conn = new DatabaseConnector(config)
		await conn.connect()
		const userCollection = new UserCollection(conn.usersCollection)
		const userTokenCollection = new UserTokenCollection(conn.userTokensCollection)
		const orgCollection = new OrganizationCollection(conn.orgsCollection)
		const mailer = nodemailer.createTransport(this.#config.smtpDetails, {
			from: this.#config.defaultFromAddress
		})
		const authenticator = new Authenticator(
			userCollection,
			userTokenCollection,
			config.jwtTokenSecret,
			mailer
		)
		const contactCollection = new ContactCollection(conn.contactsCollection)
		const engagementCollection = new EngagementCollection(conn.engagementsCollection)

		return {
			config,
			pubsub: new PubSub(),
			collections: {
				users: userCollection,
				orgs: orgCollection,
				contacts: contactCollection,
				userTokens: userTokenCollection,
				engagements: engagementCollection
			},
			components: {
				mailer,
				authenticator,
				dbConnector: conn
			}
		}
	}
}
