/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Configuration } from '~components'
import { create, database, config, up, down, status, init } from 'migrate-mongo'
import path from 'path'
import fs from 'fs'
import { Db } from 'mongodb'
import { reject } from 'lodash'

export class Migrator {
	private _db: Db | undefined

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

	public async connect() {
		const { db } = await database.connect()
		this._db = db
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
		console.log('migrating up...')
		const migrated = await up(this.db)
		migrated.forEach((fileName) => console.log('Migrated:', fileName))
	}

	public async down(): Promise<any> {
		console.log('migrating down...')
		const migratedDown = await down(this.db)
		migratedDown.forEach((fileName) => console.log('Migrated Down:', fileName))
	}

	public async status(): Promise<string> {
		const migrationStatus = await status(this.db)
		let message = ''
		migrationStatus.forEach(({ fileName, appliedAt }) => (message += `${fileName}: ${appliedAt}\n`))
		return message
	}

	public async seed(files: string[]) {
		console.log(`seeding ${files.length} files...`)
		for (const file of files) {
			const collection = path.basename(file).replace('.json', '')
			const fileData = fs.readFileSync(file, { encoding: 'utf-8' })
			const docs = fileData
				.split('\n')
				.map((p) => p.trim())
				.filter((p) => !!p)
				.map((p) => JSON.parse(p))
			console.log(`seeding collection ${collection} with ${docs.length} documents...`)
			await new Promise<void>((resolve, rejec) => {
				this._db?.collection(collection).insertMany(docs, (err) => {
					if (err) {
						reject(err)
					} else {
						resolve()
					}
				})
			})
		}
	}
}
