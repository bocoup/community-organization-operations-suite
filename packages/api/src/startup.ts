/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import http from 'http'
import path from 'path'
import fs from 'fs'
import { container } from 'tsyringe'
import { createLogger } from '~utils'
import {
	Migrator,
	DatabaseConnector,
	AppBuilder,
	Configuration,
	RequestContextBuilder,
	Authenticator,
	TokenIssuer,
	ApolloServerBuilder,
	FastifyServerBuilder,
	Localization,
	MailerProvider,
	Notifications,
	Publisher,
	SubscriptionServerBuilder,
	Telemetry,
	OrgAuthStrategyListProvider
} from '~components'
import {
	ContactCollection,
	EngagementCollection,
	OrganizationCollection,
	ServiceAnswerCollection,
	ServiceCollection,
	TagCollection,
	UserCollection
} from '~db'

const logger = createLogger('startup', true)

export async function startup(): Promise<http.Server> {
	try {
		container.register(Configuration, Configuration)
		container.register(DatabaseConnector, DatabaseConnector)
		container.register(Migrator, Migrator)
		container.register(UserCollection, UserCollection)
		container.register(ContactCollection, ContactCollection)
		container.register(EngagementCollection, EngagementCollection)
		container.register(OrganizationCollection, OrganizationCollection)
		container.register(ServiceAnswerCollection, ServiceAnswerCollection)
		container.register(ServiceCollection, ServiceCollection)
		container.register(TagCollection, TagCollection)
		container.register(UserCollection, UserCollection)
		container.register(TokenIssuer, TokenIssuer)
		container.register(Authenticator, Authenticator)
		container.register(Localization, Localization)
		container.register(MailerProvider, MailerProvider)
		container.register(Migrator, Migrator)
		container.register(Notifications, Notifications)
		container.register(Publisher, Publisher)
		container.register(Telemetry, Telemetry)
		container.register(OrgAuthStrategyListProvider, OrgAuthStrategyListProvider)
		container.register(RequestContextBuilder, RequestContextBuilder)
		container.register(ApolloServerBuilder, ApolloServerBuilder)
		container.register(FastifyServerBuilder, FastifyServerBuilder)
		container.register(SubscriptionServerBuilder, SubscriptionServerBuilder)
		container.register(AppBuilder, AppBuilder)

		const config = container.resolve(Configuration)
		const connector = container.resolve(DatabaseConnector)
		const appBuilder = container.resolve(AppBuilder)
		const migrator = container.resolve(Migrator)

		logger('performing startup migrations')
		await performDatabaseMigrationsAndSeeding(config, migrator)
		await connector.connect()
		logger(`preparing server`)
		logger('starting server...')
		return appBuilder.start()
	} catch (err) {
		logger('error starting app', err)
		throw err
	}
}

async function performDatabaseMigrationsAndSeeding(config: Configuration, migrator: Migrator) {
	// This should prevent accidental seed data from accidentally being inserted into Azure environments
	// (e.g. when a dev uses an env-var override locally)
	const isSeedTargetStable = config.dbSeedConnectionString === config.dbConnectionString
	if (!isSeedTargetStable) {
		logger('unstable seed target, skipping DB seeding')
	} else {
		await migrator.connect()

		if (config.dbAutoMigrate) {
			await migrator.up()
		}

		if (config.dbSeedMockData) {
			const SEED_FILE_ROOT = path.join(__dirname, '../mock_data')
			const seedFiles = fs.readdirSync(SEED_FILE_ROOT).map((f) => path.join(SEED_FILE_ROOT, f))
			// Seed the mock data fresh (delete old data)
			await migrator.seed(seedFiles, true)
		}
	}
}
