/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IResolvers } from '@graphql-tools/utils'
import { EngagementResponse, MentionEvent, Resolvers } from '@cbosuite/schema/dist/provider-types'
import * as primitives from './primitives'
import { types } from './types'
import { container, InjectionToken } from 'tsyringe'
import { GetOrganizationsInteractor } from '~interactors/GetOrganizationsInteractor'
import { GetOrganizationInteractor } from '~interactors/GetOrganizationInteractor'
import { GetUserInteractor } from '~interactors/GetUserInteractor'
import { GetContactInteractor } from '~interactors/GetContactInteractor'
import { GetContactsInteractor } from '~interactors/GetContactsInteractor'
import { GetEngagementInteractor } from '~interactors/GetEngagementInteractor'
import { GetActiveEngagementsInteractor } from '~interactors/GetActiveEngagementsInteractor'
import { GetInactiveEngagementsInteractor } from '~interactors/GetInactiveEngagementsInteractor'
import { ExportDataInteractor } from '~interactors/ExportDataInteractor'
import { GetServicesInteractor } from '~interactors/GetServicesInteractor'
import { GetServicesAnswersInteractor } from '~interactors/GetServiceAnswersInteractor'
import { AuthenticateInteractor } from '~interactors/AuthenticateInteractor'
import { CreateEngagementInteractor } from '~interactors/CreateEngagementInteractor'
import { UpdateEngagementInteractor } from '~interactors/UpdateEngagementInteractor'
import { AssignEngagementInteractor } from '~interactors/AssignEngagementInteractor'
import { CompleteEngagementInteractor } from '~interactors/CompleteEngagementInteractor'
import { SetEngagementStatusInteractor } from '~interactors/SetEngagementStatusInteractor'
import { AddEngagementActionInteractor } from '~interactors/AddEngagementActionInteractor'
import { InitiatePasswordResetInteractor } from '~interactors/InitiatePasswordReset'
import { ExecutePasswordResetInteractor } from '~interactors/ExecutePasswordResetInteractor'
import { ResetUserPasswordInteractor } from '~interactors/ResetUserPasswordInteractor'
import { SetUserPasswordInteractor } from '~interactors/SetUserPasswordInteractor'
import { CreateNewUserInteractor } from '~interactors/CreateNewUserInteractor'
import { UpdateUserInteractor } from '~interactors/UpdateUserInteractor'
import { DeleteUserInteractor } from '~interactors/DeleteUserInteractor'
import { UpdateUserFCMTokenInteractor } from '~interactors/UpdateUserFCMTokenInteractor'
import { MarkMentionSeenInteractor } from '~interactors/MarkMentionSeenInteractor'
import { MarkMentionDismissedInteractor } from '~interactors/MarkMentionDismissedInteractor'
import { CreateNewTagInteractor } from '~interactors/CreateNewTagInteractor'
import { UpdateTagInteractor } from '~interactors/UpdateTagInteractor'
import { CreateContactInteractor } from '~interactors/CreateContactInteractor'
import { UpdateServiceAnswerInteractor } from '~interactors/UpdateServiceAnswerInteractor'
import { DeleteServiceAnswerInteractor } from '~interactors/DeleteServiceAnswerInteractor'
import { CreateServiceAnswerInteractor } from '~interactors/CreateServiceAnswerInteractor'
import { UpdateServiceInteractor } from '~interactors/UpdateServiceInteractor'
import { CreateServiceInteractor } from '~interactors/CreateServiceInteractor'
import { ArchiveContactInteractor } from '~interactors/ArchiveContactInteractor'
import { UpdateContactInteractor } from '~interactors/UpdateContactInteractor'
import { Publisher } from '~components/Publisher'
import { Interactor, RequestContext } from '~types'

function resolve<Args, Result>(
	tok: InjectionToken<Interactor<Args, Result>>,
	args: Args,
	ctx: RequestContext
): Promise<Result> {
	return container.resolve(tok).execute(args, ctx)
}

export const resolvers: Resolvers<RequestContext> & IResolvers<any, RequestContext> = {
	...primitives,
	...types,
	Query: {
		organizations: (_, args, ctx) => resolve(GetOrganizationsInteractor, args, ctx),
		organization: (_, args, ctx) => resolve(GetOrganizationInteractor, args, ctx),
		user: (_, args, ctx) => resolve(GetUserInteractor, args, ctx),
		contact: (_, args, ctx) => resolve(GetContactInteractor, args, ctx),
		contacts: (_, args, ctx) => resolve(GetContactsInteractor, args, ctx),
		engagement: (_, args, ctx) => resolve(GetEngagementInteractor, args, ctx),
		activeEngagements: (_, args, ctx) => resolve(GetActiveEngagementsInteractor, args, ctx),
		inactiveEngagements: (_, args, ctx) => resolve(GetInactiveEngagementsInteractor, args, ctx),
		exportData: (_, args, ctx) => resolve(ExportDataInteractor, args, ctx),
		services: (_, args, ctx) => resolve(GetServicesInteractor, args, ctx),
		serviceAnswers: (_, args, ctx) => resolve(GetServicesAnswersInteractor, args, ctx)
	},
	Mutation: {
		authenticate: (_, args, ctx) => resolve(AuthenticateInteractor, args, ctx),
		createEngagement: (_, args, ctx) => resolve(CreateEngagementInteractor, args, ctx),
		updateEngagement: (_, args, ctx) => resolve(UpdateEngagementInteractor, args, ctx),
		assignEngagement: (_, args, ctx) => resolve(AssignEngagementInteractor, args, ctx),
		completeEngagement: (_, args, ctx) => resolve(CompleteEngagementInteractor, args, ctx),
		setEngagementStatus: (_, args, ctx) => resolve(SetEngagementStatusInteractor, args, ctx),
		addEngagementAction: (_, args, ctx) => resolve(AddEngagementActionInteractor, args, ctx),
		initiatePasswordReset: (_, args, ctx) => resolve(InitiatePasswordResetInteractor, args, ctx),
		executePasswordReset: (_, args, ctx) => resolve(ExecutePasswordResetInteractor, args, ctx),
		resetUserPassword: (_, args, ctx) => resolve(ResetUserPasswordInteractor, args, ctx),
		setUserPassword: (_, args, ctx) => resolve(SetUserPasswordInteractor, args, ctx),
		createNewUser: (_, args, ctx) => resolve(CreateNewUserInteractor, args, ctx),
		updateUser: (_, args, ctx) => resolve(UpdateUserInteractor, args, ctx),
		deleteUser: (_, args, ctx) => resolve(DeleteUserInteractor, args, ctx),
		updateUserFCMToken: (_, args, ctx) => resolve(UpdateUserFCMTokenInteractor, args, ctx),
		markMentionSeen: (_, args, ctx) => resolve(MarkMentionSeenInteractor, args, ctx),
		markMentionDismissed: (_, args, ctx) => resolve(MarkMentionDismissedInteractor, args, ctx),
		createNewTag: (_, args, ctx) => resolve(CreateNewTagInteractor, args, ctx),
		updateTag: (_, args, ctx) => resolve(UpdateTagInteractor, args, ctx),
		createContact: (_, args, ctx) => resolve(CreateContactInteractor, args, ctx),
		updateContact: (_, args, ctx) => resolve(UpdateContactInteractor, args, ctx),
		archiveContact: (_, args, ctx) => resolve(ArchiveContactInteractor, args, ctx),
		createService: (_, args, ctx) => resolve(CreateServiceInteractor, args, ctx),
		updateService: (_, args, ctx) => resolve(UpdateServiceInteractor, args, ctx),
		createServiceAnswer: (_, args, ctx) => resolve(CreateServiceAnswerInteractor, args, ctx),
		deleteServiceAnswer: (_, args, ctx) => resolve(DeleteServiceAnswerInteractor, args, ctx),
		updateServiceAnswer: (_, args, ctx) => resolve(UpdateServiceAnswerInteractor, args, ctx)
	},
	Subscription: {
		mentions: {
			subscribe: (_, { userId }) => container.resolve(Publisher).subscribeToMentions(userId),
			resolve: (payload: MentionEvent) => payload
		},
		engagements: {
			subscribe: (_, { orgId }) => container.resolve(Publisher).subscribeToEngagements(orgId),
			resolve: (payload: EngagementResponse) => payload
		}
	}
}
