/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
import { PubSub } from 'apollo-server'
import { AsyncProvider, BuiltAppContext } from '~types'
import nodemailer from 'nodemailer'
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
import { UpdateUserInteractor } from '~interactors/UpdateUserInteractor'
import { UpdateUserFCMTokenInteractor } from '~interactors/UpdateUserFCMTokenInteractor'
import { MarkMentionSeenInteractor } from '~interactors/MarkMentionSeenInteractor'
import { MarkMentionDismissedInteractor } from '~interactors/MarkMentionDismissedInteractor'
import { CreateNewTagInteractor } from '~interactors/CreateNewTagInteractor'
import { UpdateContactInteractor } from '~interactors/UpdateContactInteractor'
import { CreateAttributeInteractor } from '~interactors/CreateAttributeInteractor'
import { UpdateAttributeInteractor } from '~interactors/UpdateAttributeInteractor'
import { CreateServiceInteractor } from '~interactors/CreateServiceInteractor'
import { UpdateServiceInteractor } from '~interactors/UpdateServiceInteractor'
import { CreateContactInteractor } from '~interactors/CreateContactInteractor'
import { UpdateTagInteractor } from '~interactors/UpdateTagInteractor'
const sgTransport = require('nodemailer-sendgrid-transport')

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
		const tagCollection = new TagCollection(conn.tagsCollection)
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
			mailer
		)
		const contactCollection = new ContactCollection(conn.contactsCollection)
		const engagementCollection = new EngagementCollection(conn.engagementsCollection)
		const serviceCollection = new ServiceCollection(conn.servicesCollection)
		const pubsub = new PubSub()

		return {
			config,
			pubsub,
			interactors: {
				authenticate: new AuthenticateInteractor(authenticator, localization),
				createEngagement: new CreateEngagementInteractor(
					localization,
					pubsub,
					engagementCollection,
					userCollection,
					notifier
				),
				assignEngagement: new AssignEngagementInteractor(
					localization,
					pubsub,
					engagementCollection,
					userCollection,
					notifier
				),
				updateEngagement: new UpdateEngagementInteractor(
					localization,
					pubsub,
					engagementCollection,
					userCollection
				),
				completeEngagement: new CompleteEngagementInteractor(
					localization,
					engagementCollection,
					pubsub
				),
				setEngagementStatus: new SetEngagementStatusInteractor(
					localization,
					engagementCollection,
					pubsub
				),
				addEngagement: new AddEngagementInteractor(
					localization,
					engagementCollection,
					userCollection,
					pubsub
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
				updateUser: new UpdateUserInteractor(localization, userCollection),
				updateUserFCMToken: new UpdateUserFCMTokenInteractor(localization, userCollection),
				markMentionSeen: new MarkMentionSeenInteractor(localization, userCollection),
				markMentionDismissed: new MarkMentionDismissedInteractor(localization, userCollection),
				createNewTag: new CreateNewTagInteractor(localization, tagCollection, orgCollection),
				updateTag: new UpdateTagInteractor(localization, tagCollection),
				createContact: new CreateContactInteractor(localization, contactCollection, orgCollection),
				updateContact: new UpdateContactInteractor(
					localization,
					config,
					contactCollection,
					engagementCollection,
					orgCollection
				),
				createAttribute: new CreateAttributeInteractor(localization, orgCollection),
				updateAttribute: new UpdateAttributeInteractor(localization, orgCollection),
				createService: new CreateServiceInteractor(localization, serviceCollection),
				updateService: new UpdateServiceInteractor(localization, serviceCollection)
			},
			collections: {
				users: userCollection,
				orgs: orgCollection,
				contacts: contactCollection,
				userTokens: userTokenCollection,
				engagements: engagementCollection,
				tags: tagCollection,
				services: serviceCollection
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
