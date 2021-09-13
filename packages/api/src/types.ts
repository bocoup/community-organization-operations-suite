/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	AuthenticationInput,
	AuthenticationResponse,
	ChangeUserPasswordInput,
	ContactInput,
	ContactResponse,
	EngagementActionInput,
	EngagementIdInput,
	EngagementInput,
	EngagementResponse,
	EngagementUserInput,
	ForgotUserPasswordInput,
	ForgotUserPasswordResponse,
	MentionUserInput,
	OrgTagInput,
	PasswordChangeInput,
	RoleType,
	ServiceInput,
	ServiceAnswerInput,
	ServiceResponse,
	TagResponse,
	UserActionResponse,
	UserFcmInput,
	UserIdInput,
	UserInput,
	UserResponse,
	ValidateResetUserPasswordTokenInput,
	VoidResponse
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
		authenticate: Interactor<AuthenticationInput, AuthenticationResponse>
		createEngagement: Interactor<EngagementInput, EngagementResponse>
		updateEngagement: Interactor<EngagementInput, EngagementResponse>
		assignEngagement: Interactor<EngagementUserInput, EngagementResponse>
		completeEngagement: Interactor<EngagementIdInput, EngagementResponse>
		setEngagementStatus: Interactor<EngagementIdInput, EngagementResponse>
		addEngagement: Interactor<EngagementActionInput, EngagementResponse>
		forgotUserPassword: Interactor<ForgotUserPasswordInput, ForgotUserPasswordResponse>
		validateResetUserPasswordToken: Interactor<
			ValidateResetUserPasswordTokenInput,
			ForgotUserPasswordResponse
		>
		changeUserPassword: Interactor<ChangeUserPasswordInput, ForgotUserPasswordResponse>
		resetUserPassword: Interactor<UserIdInput, UserActionResponse>
		setUserPassword: Interactor<PasswordChangeInput, UserActionResponse>
		createNewUser: Interactor<UserInput, UserResponse>
		updateUser: Interactor<UserInput, UserResponse>
		updateUserFCMToken: Interactor<UserFcmInput, VoidResponse>
		markMentionSeen: Interactor<MentionUserInput, UserResponse>
		markMentionDismissed: Interactor<MentionUserInput, UserResponse>
		createNewTag: Interactor<OrgTagInput, TagResponse>
		updateTag: Interactor<OrgTagInput, TagResponse>
		createContact: Interactor<ContactInput, ContactResponse>
		updateContact: Interactor<ContactInput, ContactResponse>
		createService: Interactor<ServiceInput, ServiceResponse>
		updateService: Interactor<ServiceInput, ServiceResponse>
		createServiceAnswers: Interactor<ServiceAnswerInput, ServiceResponse>
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

export interface HealthStatus {
	status: string
}
