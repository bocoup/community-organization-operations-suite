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
	EngagementCollection,
	TagCollection,
	ServiceCollection
} from '~db'
import { AsyncProvider, BuiltAppContext, OrgAuthEvaluationStrategy } from '~types'
import nodemailer from 'nodemailer'
import { PubSub } from 'graphql-subscriptions'
import { AuthenticateInteractor } from '~interactors/AuthenticateInteractor'
import { CreateEngagementInteractor } from '~interactors/CreateEngagementInteractor'
import { AssignEngagementInteractor } from '~interactors/AssignEngagementInteractor'
import { UpdateEngagementInteractor } from '~interactors/UpdateEngagementInteractor'
import { CompleteEngagementInteractor } from '~interactors/CompleteEngagementInteractor'
import { SetEngagementStatusInteractor } from '~interactors/SetEngagementStatusInteractor'
import { AddEngagementActionInteractor } from '~interactors/AddEngagementActionInteractor'
import { InitiatePasswordResetInteractor } from '~interactors/InitiatePasswordReset'
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
import { CreateServiceAnswerInteractor } from '~interactors/CreateServiceAnswerInteractor'
import { DeleteServiceAnswerInteractor } from '~interactors/DeleteServiceAnswerInteractor'
import { UpdateServiceAnswerInteractor } from '~interactors/UpdateServiceAnswerInteractor'
import { Migrator } from './Migrator'
import { createLogger } from '~utils'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { Publisher } from './Publisher'
import { GetOrganizationsInteractor } from '~interactors/GetOrganizationsInteractor'
import { GetOrganizationInteractor } from '~interactors/GetOrganizationInteractor'
import { GetUserInteractor } from '~interactors/GetUserInteractor'
import { GetContactInteractor } from '~interactors/GetContactInteractor'
import { GetContactsInteractor } from '~interactors/GetContactsInteractor'
import { GetEngagementInteractor } from '~interactors/GetEngagementInteractor'
import { GetActiveEngagementsInteractor } from '~interactors/GetActiveEngagementsInteractor'
import { GetInactiveEngagementsInteractor } from '~interactors/GetInactiveEngagementsInteractor'
import { ExportDataInteractor } from '~interactors/ExportDataInteractor'
import { GetServicesAnswersInteractor } from '~interactors/GetServiceAnswersInteractor'
import { GetServicesInteractor } from '~interactors/GetServicesInteractor'
import { TokenIssuer } from './TokenIssuer'
import { ExecutePasswordResetInteractor } from '~interactors/ExecutePasswordResetInteractor'
import {
	EntityIdToOrgIdStrategy,
	InputEntityToOrgIdStrategy,
	InputServiceAnswerEntityToOrgIdStrategy,
	OrganizationSrcStrategy,
	OrgIdArgStrategy,
	UserWithinOrgStrategy
} from './orgAuthStrategies'

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
		const orgCollection = new OrganizationCollection(conn.orgsCollection)
		const tagCollection = new TagCollection(conn.tagsCollection)
		const serviceAnswerCollection = new ServiceAnswerCollection(conn.serviceAnswerCollection)
		const localization = new Localization()
		const notifier = new Notifications(config, localization)
		const mailer = nodemailer.createTransport(
			sgTransport({
				auth: {
					api_key: config.sendgridApiKey
				}
			})
		)
		const tokenIssuer = new TokenIssuer(
			config.jwtTokenSecret,
			config.authTokenExpiry,
			config.passwordResetTokenExpiry
		)
		const authenticator = new Authenticator(userCollection, tokenIssuer)
		const contactCollection = new ContactCollection(conn.contactsCollection)
		const engagementCollection = new EngagementCollection(conn.engagementsCollection)
		const serviceCollection = new ServiceCollection(conn.servicesCollection)
		const pubsub = new PubSub()
		const publisher = new Publisher(pubsub, localization)

		// A list of strategies to try when determining how to evaluate OrgAuth
		const orgAuthEvaluationStrategies: OrgAuthEvaluationStrategy[] = [
			new OrganizationSrcStrategy(authenticator),
			new OrgIdArgStrategy(authenticator),
			new EntityIdToOrgIdStrategy(authenticator),
			new InputEntityToOrgIdStrategy(authenticator),
			new InputServiceAnswerEntityToOrgIdStrategy(authenticator),
			new UserWithinOrgStrategy(authenticator)
		]

		return {
			config,
			interactors: {
				/**
				 * Queries
				 */
				getOrganizations: new GetOrganizationsInteractor(
					orgCollection,
					config.defaultPageOffset,
					config.defaultPageLimit
				),
				getOrganization: new GetOrganizationInteractor(orgCollection),
				getUser: new GetUserInteractor(userCollection),
				getContact: new GetContactInteractor(contactCollection),
				getContacts: new GetContactsInteractor(
					contactCollection,
					config.defaultPageOffset,
					config.defaultPageLimit
				),
				getEngagement: new GetEngagementInteractor(engagementCollection),
				getActiveEngagements: new GetActiveEngagementsInteractor(
					engagementCollection,
					config.defaultPageOffset,
					config.defaultPageLimit
				),
				getInactiveEngagements: new GetInactiveEngagementsInteractor(
					engagementCollection,
					config.defaultPageOffset,
					config.defaultPageLimit
				),
				exportData: new ExportDataInteractor(engagementCollection),
				getServices: new GetServicesInteractor(serviceCollection),
				getServiceAnswers: new GetServicesAnswersInteractor(
					serviceCollection,
					serviceAnswerCollection
				),

				/**
				 * Mutators
				 */
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
				addEngagementAction: new AddEngagementActionInteractor(
					localization,
					engagementCollection,
					userCollection,
					publisher
				),
				initiatePasswordReset: new InitiatePasswordResetInteractor(
					config,
					localization,
					tokenIssuer,
					userCollection,
					mailer
				),
				executePasswordReset: new ExecutePasswordResetInteractor(
					localization,
					tokenIssuer,
					userCollection
				),
				resetUserPassword: new ResetUserPasswordInteractor(
					localization,
					config,
					authenticator,
					mailer,
					userCollection
				),
				setUserPassword: new SetUserPasswordInteractor(localization, userCollection),
				createNewUser: new CreateNewUserInteractor(localization, mailer, userCollection, config),
				deleteUser: new DeleteUserInteractor(localization, userCollection, engagementCollection),
				updateUser: new UpdateUserInteractor(localization, userCollection),
				updateUserFCMToken: new UpdateUserFCMTokenInteractor(localization, userCollection),
				markMentionSeen: new MarkMentionSeenInteractor(localization, userCollection),
				markMentionDismissed: new MarkMentionDismissedInteractor(localization, userCollection),
				createNewTag: new CreateNewTagInteractor(localization, tagCollection),
				updateTag: new UpdateTagInteractor(localization, tagCollection),
				createContact: new CreateContactInteractor(localization, contactCollection),
				updateContact: new UpdateContactInteractor(localization, contactCollection),
				archiveContact: new ArchiveContactInteractor(localization, contactCollection),
				createService: new CreateServiceInteractor(localization, serviceCollection),
				updateService: new UpdateServiceInteractor(localization, serviceCollection),
				createServiceAnswer: new CreateServiceAnswerInteractor(
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
				notifier,
				publisher,
				tokenIssuer,
				orgAuthEvaluationStrategies
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
