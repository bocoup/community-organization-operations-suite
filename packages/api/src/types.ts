/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	AuthenticationResponse,
	ContactResponse,
	EngagementResponse,
	RoleType,
	ServiceResponse,
	TagResponse,
	UserResponse,
	VoidResponse,
	ServiceAnswerResponse,
	Organization,
	User as ServiceUser,
	Contact,
	Engagement,
	Service,
	ServiceAnswer,
	QueryOrganizationArgs,
	QueryExportDataArgs,
	QueryServicesArgs,
	QueryUserArgs,
	MutationResetUserPasswordArgs,
	MutationDeleteUserArgs,
	MutationArchiveContactArgs,
	QueryContactArgs,
	QueryContactsArgs,
	QueryEngagementArgs,
	MutationCompleteEngagementArgs,
	MutationSetEngagementStatusArgs,
	QueryActiveEngagementsArgs,
	QueryInactiveEngagementsArgs,
	QueryServiceAnswersArgs,
	QueryOrganizationsArgs,
	MutationAuthenticateArgs,
	MutationAssignEngagementArgs,
	MutationAddEngagementActionArgs,
	MutationForgotUserPasswordArgs,
	MutationValidateResetUserPasswordTokenArgs,
	MutationChangeUserPasswordArgs,
	MutationSetUserPasswordArgs,
	MutationUpdateUserFcmTokenArgs,
	MutationMarkMentionSeenArgs,
	MutationMarkMentionDismissedArgs,
	MutationCreateNewTagArgs,
	MutationUpdateTagArgs,
	MutationDeleteServiceAnswerArgs,
	MutationUpdateContactArgs,
	MutationCreateContactArgs,
	MutationCreateServiceAnswerArgs,
	MutationUpdateServiceAnswerArgs,
	MutationCreateNewUserArgs,
	MutationUpdateUserArgs,
	MutationCreateServiceArgs,
	MutationUpdateServiceArgs,
	MutationCreateEngagementArgs,
	MutationUpdateEngagementArgs
} from '@cbosuite/schema/dist/provider-types'
import { Configuration, Authenticator, Localization, Notifications } from '~components'
import { DatabaseConnector } from '~components/DatabaseConnector'
import {
	ContactCollection,
	DbUser,
	OrganizationCollection,
	UserCollection,
	UserTokenCollection,
	EngagementCollection,
	TagCollection,
	ServiceCollection
} from '~db'
import { PubSub } from 'graphql-subscriptions'
import { Transporter } from 'nodemailer'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'

export interface Interactor<I, O> {
	execute(input: I, requestCtx: RequestContext): Promise<O>
}

export interface Provider<T> {
	get(): T
}
export interface AsyncProvider<T> {
	get(): Promise<T>
}

export type User = DbUser

export interface AuthArgs {
	/**
	 * The ID of the organization being authenticated into
	 */
	orgId: string
	requires: RoleType
}

export interface BuiltAppContext {
	pubsub: PubSub
	config: Configuration
	interactors: {
		/**
		 * Queries
		 */
		getOrganizations: Interactor<QueryOrganizationsArgs, Organization[]>
		getOrganization: Interactor<QueryOrganizationArgs, Organization | null>
		getUser: Interactor<QueryUserArgs, ServiceUser | null>
		getContact: Interactor<QueryContactArgs, Contact | null>
		getContacts: Interactor<QueryContactsArgs, Contact[]>
		getEngagement: Interactor<QueryEngagementArgs, Engagement | null>
		getActiveEngagements: Interactor<QueryActiveEngagementsArgs, Engagement[]>
		getInactiveEngagements: Interactor<QueryInactiveEngagementsArgs, Engagement[]>
		exportData: Interactor<QueryExportDataArgs, Engagement[]>
		getServices: Interactor<QueryServicesArgs, Service[]>
		getServiceAnswers: Interactor<QueryServiceAnswersArgs, ServiceAnswer[]>

		/**
		 * Mutators
		 */
		authenticate: Interactor<MutationAuthenticateArgs, AuthenticationResponse>
		createEngagement: Interactor<MutationCreateEngagementArgs, EngagementResponse>
		updateEngagement: Interactor<MutationUpdateEngagementArgs, EngagementResponse>
		assignEngagement: Interactor<MutationAssignEngagementArgs, EngagementResponse>
		completeEngagement: Interactor<MutationCompleteEngagementArgs, EngagementResponse>
		setEngagementStatus: Interactor<MutationSetEngagementStatusArgs, EngagementResponse>
		addEngagementAction: Interactor<MutationAddEngagementActionArgs, EngagementResponse>
		forgotUserPassword: Interactor<MutationForgotUserPasswordArgs, VoidResponse>
		validateResetUserPasswordToken: Interactor<
			MutationValidateResetUserPasswordTokenArgs,
			VoidResponse
		>
		changeUserPassword: Interactor<MutationChangeUserPasswordArgs, VoidResponse>
		resetUserPassword: Interactor<MutationResetUserPasswordArgs, UserResponse>
		setUserPassword: Interactor<MutationSetUserPasswordArgs, UserResponse>
		createNewUser: Interactor<MutationCreateNewUserArgs, UserResponse>
		deleteUser: Interactor<MutationDeleteUserArgs, VoidResponse>
		updateUser: Interactor<MutationUpdateUserArgs, UserResponse>
		updateUserFCMToken: Interactor<MutationUpdateUserFcmTokenArgs, VoidResponse>
		markMentionSeen: Interactor<MutationMarkMentionSeenArgs, UserResponse>
		markMentionDismissed: Interactor<MutationMarkMentionDismissedArgs, UserResponse>
		createNewTag: Interactor<MutationCreateNewTagArgs, TagResponse>
		updateTag: Interactor<MutationUpdateTagArgs, TagResponse>
		createContact: Interactor<MutationCreateContactArgs, ContactResponse>
		updateContact: Interactor<MutationUpdateContactArgs, ContactResponse>
		archiveContact: Interactor<MutationArchiveContactArgs, VoidResponse>
		createService: Interactor<MutationCreateServiceArgs, ServiceResponse>
		updateService: Interactor<MutationUpdateServiceArgs, ServiceResponse>
		createServiceAnswer: Interactor<MutationCreateServiceAnswerArgs, ServiceAnswerResponse>
		deleteServiceAnswer: Interactor<MutationDeleteServiceAnswerArgs, VoidResponse>
		updateServiceAnswer: Interactor<MutationUpdateServiceAnswerArgs, ServiceAnswerResponse>
	}
	components: {
		mailer: Transporter
		authenticator: Authenticator
		dbConnector: DatabaseConnector
		localization: Localization
		notifier: Notifications
	}
	collections: {
		users: UserCollection
		orgs: OrganizationCollection
		contacts: ContactCollection
		userTokens: UserTokenCollection
		engagements: EngagementCollection
		tags: TagCollection
		services: ServiceCollection
		serviceAnswers: ServiceAnswerCollection
	}
}

export interface RequestContext {
	identity: User | null // requesting user auth identity
	userId: string | null // requesting user id
	orgId: string | null // requesting org id
	locale: string
}

export interface AppContext extends BuiltAppContext {
	requestCtx: RequestContext
}
