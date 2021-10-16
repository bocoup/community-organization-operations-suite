/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Collection, Db, MongoClient } from 'mongodb'
import { Configuration } from './Configuration'

export class DatabaseConnector {
	private readonly _client: MongoClient
	private _db: Db | undefined

	public constructor(private readonly config: Configuration) {
		this._client = new MongoClient(this.config.dbConnectionString, {
			useUnifiedTopology: true
		})
	}

	public async connect(): Promise<void> {
		const dbName = this.config.dbDatabase
		const client = this.client
		this._db = await new Promise<Db>((resolve, reject) => {
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
		return this._client
	}

	public get db(): Db {
		if (!this._db) {
			throw new Error('database is not initialized')
		}
		return this._db
	}

	public get usersCollection(): Collection {
		return this.db.collection(this.config.dbUsersCollection)
	}

	public get userTokensCollection(): Collection {
		return this.db.collection(this.config.dbUserTokensCollection)
	}

	public get orgsCollection(): Collection {
		return this.db.collection(this.config.dbOrganizationsCollection)
	}

	public get contactsCollection(): Collection {
		return this.db.collection(this.config.dbContactsCollection)
	}
	public get engagementsCollection(): Collection {
		return this.db.collection(this.config.dbEngagementsCollection)
	}
	public get tagsCollection(): Collection {
		return this.db.collection(this.config.dbTagsCollection)
	}
	public get servicesCollection(): Collection {
		return this.db.collection(this.config.dbServicesCollection)
	}
	public get serviceAnswerCollection(): Collection {
		return this.db.collection(this.config.dbServiceAnswerCollection)
	}
}
