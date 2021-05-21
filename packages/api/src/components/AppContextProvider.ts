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
} from '~db'
import { AsyncProvider, BuiltAppContext } from '~types'

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
		const userTokenCollection = new UserTokenCollection(
			conn.userTokensCollection
		)
		const orgCollection = new OrganizationCollection(conn.orgsCollection)
		const authenticator = new Authenticator(userCollection, userTokenCollection)
		const contactCollection = new ContactCollection(conn.contactsCollection)

		return {
			config,
			collections: {
				users: userCollection,
				orgs: orgCollection,
				contacts: contactCollection,
				userTokens: userTokenCollection,
			},
			components: {
				authenticator,
				dbConnector: conn,
			},
		}
	}
}
