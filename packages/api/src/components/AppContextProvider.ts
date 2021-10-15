/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import path from 'path'
import fs from 'fs'
import { Authenticator } from './Authenticator'
import { Configuration } from './Configuration'
import { Notifications } from './Notifications'
import { DatabaseConnector } from './DatabaseConnector'
import { Localization } from './Localization'
import {
	ContactCollection,
	OrganizationCollection,
	UserCollection,
	UserTokenCollection,
	EngagementCollection,
	TagCollection,
	ServiceCollection
} from '~db'
import { AsyncProvider, BuiltAppContext } from '~types'
import nodemailer from 'nodemailer'
import { PubSub } from 'graphql-subscriptions'
import { AuthenticateInteractor } from '~interactors/AuthenticateInteractor'
import { CreateEngagementInteractor } from '~interactors/CreateEngagementInteractor'
import { AssignEngagementInteractor } from '~interactors/AssignEngagementInteractor'
import { UpdateEngagementInteractor } from '~interactors/UpdateEngagementInteractor'
import { CompleteEngagementInteractor } from '~interactors/CompleteEngagementInteractor'
import { SetEngagementStatusInteractor } from '~interactors/SetEngagementStatusInteractor'
import { AddEngagementInteractor } from '~interactors/AddEngagementInteractor'
import { ForgotUserPasswordInteractor } from '~interactors/ForgotUserPasswordInteractor'
import { ValidateResetUserPasswordTokenInteractor } from '~interactors/ValidateResetUserPasswordTokenInteractor'
import { ChangeUserPasswordInteractor } from '~interactors/ChangeUserPasswordInteractor'
import { ResetUserPasswordInteractor } from '~interactors/ResetUserPasswordInteractor'
import { SetUserPasswordInteractor } from '~interactors/SetUserPasswordInteractor'
import { CreateNewUserInteractor } from '~interactors/CreateNewUserInteractor'
import { DeleteUserInteractor } from '~interactors/DeleteUserInteractor'
import { UpdateUserInteractor } from '~interactors/UpdateUserInteractor'
import { UpdateUserFCMTokenInteractor } from '~interactors/UpdateUserFCMTokenInteractor'
import { MarkMentionSeenInteractor } from '~interactors/MarkMentionSeenInteractor'
import { MarkMentionDismissedInteractor } from '~interactors/MarkMentionDismissedInteractor'
import { CreateNewTagInteractor } from '~interactors/CreateNewTagInteractor'
import { UpdateContactInteractor } from '~interactors/UpdateContactInteractor'
import { ArchiveContactInteractor } from '~interactors/ArchiveContactInteractor'
import { CreateServiceInteractor } from '~interactors/CreateServiceInteractor'
import { UpdateServiceInteractor } from '~interactors/UpdateServiceInteractor'
import { CreateContactInteractor } from '~interactors/CreateContactInteractor'
import { UpdateTagInteractor } from '~interactors/UpdateTagInteractor'
import { CreateServiceAnswersInteractor } from '~interactors/CreateServiceAnswersInteractor'
import { DeleteServiceAnswerInteractor } from '~interactors/DeleteServiceAnswerInteractor'
import { UpdateServiceAnswerInteractor } from '~interactors/UpdateServiceAnswerInteractor'
import { Migrator } from './Migrator'
import { createLogger } from '~utils'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { Publisher } from './Publisher'

const logger = createLogger('app-context-provider')
const sgTransport = require('nodemailer-sendgrid-transport')

export class AppContextProvider implements AsyncProvider<BuiltAppContext> {
	public constructor(private readonly config: Configuration) {}

	public async get(): Promise<BuiltAppContext> {
		const config = this.config
		const conn = new DatabaseConnector(config)
		// Automigrate for integration testing, local development, etc.
		await performDatabaseMigrations(config)
		await conn.connect()
		const userCollection = new UserCollection(conn.usersCollection)
		const userTokenCollection = new UserTokenCollection(
			conn.userTokensCollection,
			config.maxUserTokens
		)
		const orgCollection = new OrganizationCollection(conn.orgsCollection)
		const tagCollection = new TagCollection(conn.tagsCollection)
		const serviceAnswerCollection = new ServiceAnswerCollection(conn.serviceAnswerCollection)
		const localization = new Localization()
		const notifier = new Notifications(config)
		const mailer = nodemailer.createTransport(
			sgTransport({
				auth: {
					api_key: config.sendgridApiKey
				}
			})
		)
		const authenticator = new Authenticator(
			userCollection,
			userTokenCollection,
			config.jwtTokenSecret,
			config.maxUserTokens
		)
		const contactCollection = new ContactCollection(conn.contactsCollection)
		const engagementCollection = new EngagementCollection(conn.engagementsCollection)
		const serviceCollection = new ServiceCollection(conn.servicesCollection)
		const pubsub = new PubSub()
		const publisher = new Publisher(pubsub, localization)

		return {
			config,
			pubsub,
			interactors: {
				authenticate: new AuthenticateInteractor(authenticator, localization),
				createEngagement: new CreateEngagementInteractor(
					localization,
					publisher,
					engagementCollection,
					userCollection,
					notifier
				),
				assignEngagement: new AssignEngagementInteractor(
					localization,
					publisher,
					engagementCollection,
					userCollection,
					notifier
				),
				updateEngagement: new UpdateEngagementInteractor(
					localization,
					publisher,
					engagementCollection,
					userCollection
				),
				completeEngagement: new CompleteEngagementInteractor(
					localization,
					engagementCollection,
					publisher
				),
				setEngagementStatus: new SetEngagementStatusInteractor(
					localization,
					engagementCollection,
					publisher
				),
				addEngagement: new AddEngagementInteractor(
					localization,
					engagementCollection,
					userCollection,
					publisher
				),
				forgotUserPassword: new ForgotUserPasswordInteractor(
					config,
					localization,
					authenticator,
					userCollection,
					mailer
				),
				validateResetUserPasswordToken: new ValidateResetUserPasswordTokenInteractor(
					localization,
					authenticator,
					userCollection
				),
				changeUserPassword: new ChangeUserPasswordInteractor(
					localization,
					authenticator,
					userCollection
				),
				resetUserPassword: new ResetUserPasswordInteractor(
					localization,
					config,
					authenticator,
					mailer,
					userCollection
				),
				setUserPassword: new SetUserPasswordInteractor(localization, authenticator),
				createNewUser: new CreateNewUserInteractor(
					localization,
					authenticator,
					mailer,
					userCollection,
					orgCollection,
					config
				),
				deleteUser: new DeleteUserInteractor(
					localization,
					userCollection,
					userTokenCollection,
					orgCollection,
					engagementCollection
				),
				updateUser: new UpdateUserInteractor(localization, userCollection),
				updateUserFCMToken: new UpdateUserFCMTokenInteractor(localization, userCollection),
				markMentionSeen: new MarkMentionSeenInteractor(localization, userCollection),
				markMentionDismissed: new MarkMentionDismissedInteractor(localization, userCollection),
				createNewTag: new CreateNewTagInteractor(localization, tagCollection, orgCollection),
				updateTag: new UpdateTagInteractor(localization, tagCollection),
				createContact: new CreateContactInteractor(localization, contactCollection, orgCollection),
				updateContact: new UpdateContactInteractor(localization, contactCollection),
				archiveContact: new ArchiveContactInteractor(localization, contactCollection),
				createService: new CreateServiceInteractor(localization, serviceCollection),
				updateService: new UpdateServiceInteractor(localization, serviceCollection),
				createServiceAnswers: new CreateServiceAnswersInteractor(
					localization,
					serviceCollection,
					serviceAnswerCollection
				),
				deleteServiceAnswer: new DeleteServiceAnswerInteractor(
					localization,
					serviceAnswerCollection
				),
				updateServiceAnswer: new UpdateServiceAnswerInteractor(
					localization,
					serviceCollection,
					serviceAnswerCollection
				)
			},
			collections: {
				users: userCollection,
				orgs: orgCollection,
				contacts: contactCollection,
				userTokens: userTokenCollection,
				engagements: engagementCollection,
				tags: tagCollection,
				services: serviceCollection,
				serviceAnswers: serviceAnswerCollection
			},
			components: {
				mailer,
				authenticator,
				dbConnector: conn,
				localization,
				notifier
			}
		}
	}
}

async function performDatabaseMigrations(config: Configuration) {
	// This should prevent accidental seed data from accidentally being inserted into Azure environments
	// (e.g. when a dev uses an env-var override locally)
	const isSeedTargetStable = config.dbSeedConnectionString === config.dbConnectionString
	if (!isSeedTargetStable) {
		logger('unstable seed target, skipping DB seeding')
	} else {
		const migrator = new Migrator(config)
		await migrator.connect()

		if (config.dbAutoMigrate) {
			await migrator.up()
		}

		if (config.dbSeedMockData) {
			const SEED_FILE_ROOT = path.join(__dirname, '../../mock_data')
			const seedFiles = fs.readdirSync(SEED_FILE_ROOT).map((f) => path.join(SEED_FILE_ROOT, f))
			// Seed the mock data fresh (delete old data)
			await migrator.seed(seedFiles, true)
		}
	}
}
