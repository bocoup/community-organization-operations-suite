/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { Configuration } from './Configuration'
import { create, database, config, up, down, status, init } from 'migrate-mongo'
import path from 'path'
import fs from 'fs'
import { Db, MongoError, MongoClient } from 'mongodb'
import { createLogger } from '~utils'
import { singleton } from 'tsyringe'
const logger = createLogger('migrator', true)

@singleton()
export class Migrator {
	private _db: Db | undefined
	private _client: MongoClient | undefined

	public constructor(private _config: Configuration) {
		// Apply api config to standard migrate-mongo db-connection config
		if (!this._config.dbConnectionString) {
			throw new Error('dbConnectionString not defined')
		}
		if (!this._config.dbDatabase) {
			throw new Error('databaseName not defined')
		}
		const mongodb = {
			url: this._config.dbConnectionString,
			databaseName: this._config.dbDatabase,
			options: {
				useNewUrlParser: true, // removes a deprecation warning when connecting
				useUnifiedTopology: true // removes a deprecating warning when connecting
			}
		}

		const migrateMongoConfig = {
			// Mongo db settings
			mongodb,
			// The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
			migrationsDir: path.join(__dirname, '../../migrations'),
			// The mongodb collection where the applied changes are stored. Only edit this when really necessary.
			changelogCollectionName: 'changelog',
			// The file extension to create migrations and search for in migration dir
			migrationFileExtension: '.ts',
			// Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
			// if the file should be run.  Requires that scripts are coded to be run multiple times.
			useFileHash: false
		}
		config.set(migrateMongoConfig)
	}

	private get db(): Db {
		if (!this._db) {
			throw new Error('no db available, did you call connect()?')
		}
		return this._db
	}

	private get client(): MongoClient {
		if (!this.client) {
			throw new Error('no client available, did you call connect()?')
		}
		return this.client
	}

	public async connect() {
		const { db, client } = await database.connect()
		this._db = db
		this._client = client
	}

	public async init(): Promise<void> {
		return init()
	}

	/**
	 * Create a new migration
	 * @param name The new migration name to create
	 */
	public async create(name: string) {
		if (!name) {
			throw new Error(
				'No migration name provided to migrate-mongo create. Please provide a valid migration name.'
			)
		}

		return await create(name)
	}

	public async up(): Promise<void> {
		logger('migrating up...')
		const migrated = await up(this.db, this.client)
		migrated.forEach((fileName) => logger('Migrated:', fileName))
	}

	public async down(): Promise<any> {
		logger('migrating down...')
		const migratedDown = await down(this.db, this.client)
		migratedDown.forEach((fileName) => logger('Migrated Down:', fileName))
	}

	public async status(): Promise<string> {
		const migrationStatus = await status(this.db)
		let message = ''
		migrationStatus.forEach(({ fileName, appliedAt }) => (message += `${fileName}: ${appliedAt}\n`))
		return message
	}

	public async seed(files: string[], fresh = false) {
		logger(`seeding ${files.length} files...`)
		for (const file of files) {
			const collectionName = path.basename(file).replace('.json', '')
			const fileData = fs.readFileSync(file, { encoding: 'utf-8' })
			const docs = fileData
				.split('\n')
				.map((p) => p.trim())
				.filter((p) => !!p)
				.map((p) => JSON.parse(p))
			logger(`seeding collection ${collectionName} with ${docs.length} documents...`)

			if (fresh) {
				try {
					await this.db.collection(collectionName).drop()
				} catch (e: unknown) {
					const error = e as MongoError
					if (error.code === 26) {
						// the collection didn't exist to begin with
					} else {
						logger(`error dropping db`, e)
						throw e
					}
				}
			}

			if (docs.length > 0) {
				await this.db.collection(collectionName).insertMany(docs)
			}
		}
	}
}
