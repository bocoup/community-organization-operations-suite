/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

// Import config component
import { Configuration } from './src/components/Configuration'

// Get api config
const apiConfig = new Configuration()
apiConfig.validate()

// Apply api config to standard migrate-mongo db-connection config
const mongodb = {
	url: apiConfig.dbConnectionString,
	databaseName: apiConfig.dbDatabase,
	options: {
		useNewUrlParser: true, // removes a deprecation warning when connecting
		useUnifiedTopology: true // removes a deprecating warning when connecting
	}
}

export const migrateMongoConfig = {
	// Mongo db settings
	mongodb,

	// The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
	migrationsDir: 'migrations',

	// The mongodb collection where the applied changes are stored. Only edit this when really necessary.
	changelogCollectionName: 'changelog',

	// The file extension to create migrations and search for in migration dir
	migrationFileExtension: '.ts',

	// Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
	// if the file should be run.  Requires that scripts are coded to be run multiple times.
	useFileHash: false
}
