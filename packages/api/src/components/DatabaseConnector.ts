/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Collection, Db, MongoClient } from 'mongodb'
import { Configuration } from './Configuration'

export class DatabaseConnector {
	#config: Configuration
	#client: MongoClient
	#db: Db | undefined

	public constructor(config: Configuration) {
		this.#config = config
		this.#client = new MongoClient(this.#config.dbConnectionString)
	}

	public async connect(): Promise<void> {
		const dbName = this.#config.dbDatabase
		const client = this.#client
		this.#db = await new Promise<Db>((resolve, reject) => {
			client.connect((err) => {
				if (err) {
					reject(err)
				} else {
					resolve(client.db(dbName))
				}
			})
		})
	}

	public get client(): MongoClient {
		return this.#client
	}

	public get db(): Db {
		if (!this.#db) {
			throw new Error('database is not initialized')
		}
		return this.#db
	}

	public get usersCollection(): Collection {
		return this.db.collection(this.#config.dbUsersCollection)
	}

	public get userTokensCollection(): Collection {
		return this.db.collection(this.#config.dbUserTokensCollection)
	}

	public get orgsCollection(): Collection {
		return this.db.collection(this.#config.dbOrganizationsCollection)
	}

	public get contactsCollection(): Collection {
		return this.db.collection(this.#config.dbContactsCollection)
	}
}
