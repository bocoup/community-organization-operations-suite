/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IResolvers } from '@graphql-tools/utils'
import { AppContext } from '~types'
import { EngagementResponse, MentionEvent, Resolvers } from '@cbosuite/schema/dist/provider-types'
import * as primitives from './primitives'
import { types } from './types'
import { container } from 'tsyringe'
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
import { Publisher } from '~components'

export const resolvers: Resolvers<AppContext> & IResolvers<any, AppContext> = {
	...primitives,
	...types,
	Query: {
		organizations: async (_, args) => container.resolve(GetOrganizationsInteractor).execute(args),
		organization: async (_, args) => container.resolve(GetOrganizationInteractor).execute(args),
		user: async (_, args, { requestCtx }) =>
			container.resolve(GetUserInteractor).execute(args, requestCtx),
		contact: async (_, args, { requestCtx }) =>
			container.resolve(GetContactInteractor).execute(args, requestCtx),
		contacts: async (_, args, { requestCtx }) =>
			container.resolve(GetContactsInteractor).execute(args, requestCtx),
		engagement: async (_, args, { requestCtx }) =>
			container.resolve(GetEngagementInteractor).execute(args, requestCtx),
		activeEngagements: async (_, args, { requestCtx }) =>
			container.resolve(GetActiveEngagementsInteractor).execute(args, requestCtx),
		inactiveEngagements: async (_, args, { requestCtx }) =>
			container.resolve(GetInactiveEngagementsInteractor).execute(args, requestCtx),
		exportData: async (_, args, { requestCtx }) =>
			container.resolve(ExportDataInteractor).execute(args, requestCtx),
		services: async (_, args, ctx) =>
			container.resolve(GetServicesInteractor).execute(args, ctx.requestCtx),
		serviceAnswers: async (_, args, { requestCtx }) =>
			container.resolve(GetServicesAnswersInteractor).execute(args, requestCtx)
	},
	Mutation: {
		authenticate: (_, args, { requestCtx }) =>
			container.resolve(AuthenticateInteractor).execute(args, requestCtx),
		createEngagement: (_, args, { requestCtx }) =>
			container.resolve(CreateEngagementInteractor).execute(args, requestCtx),
		updateEngagement: async (_, args, { requestCtx }) =>
			container.resolve(UpdateEngagementInteractor).execute(args, requestCtx),
		assignEngagement: async (_, args, { requestCtx }) =>
			container.resolve(AssignEngagementInteractor).execute(args, requestCtx),
		completeEngagement: async (_, args, { requestCtx }) =>
			container.resolve(CompleteEngagementInteractor).execute(args, requestCtx),
		setEngagementStatus: async (_, args, { requestCtx }) =>
			container.resolve(SetEngagementStatusInteractor).execute(args, requestCtx),
		addEngagementAction: async (_, args, { requestCtx }) =>
			container.resolve(AddEngagementActionInteractor).execute(args, requestCtx),
		initiatePasswordReset: async (_, args, { requestCtx }) =>
			container.resolve(InitiatePasswordResetInteractor).execute(args, requestCtx),
		executePasswordReset: async (_, args, { requestCtx }) =>
			container.resolve(ExecutePasswordResetInteractor).execute(args, requestCtx),
		resetUserPassword: async (_, args, { requestCtx }) =>
			container.resolve(ResetUserPasswordInteractor).execute(args, requestCtx),
		setUserPassword: async (_, args, { requestCtx }) =>
			container.resolve(SetUserPasswordInteractor).execute(args, requestCtx),
		createNewUser: async (_, args, { requestCtx }) =>
			container.resolve(CreateNewUserInteractor).execute(args, requestCtx),
		updateUser: async (_, args, { requestCtx }) =>
			container.resolve(UpdateUserInteractor).execute(args, requestCtx),
		deleteUser: async (_, args, { requestCtx }) =>
			container.resolve(DeleteUserInteractor).execute(args, requestCtx),
		updateUserFCMToken: async (_, args, { requestCtx }) =>
			container.resolve(UpdateUserFCMTokenInteractor).execute(args, requestCtx),
		markMentionSeen: async (_, args, { requestCtx }) =>
			container.resolve(MarkMentionSeenInteractor).execute(args, requestCtx),
		markMentionDismissed: async (_, args, { requestCtx }) =>
			container.resolve(MarkMentionDismissedInteractor).execute(args, requestCtx),
		createNewTag: async (_, args, { requestCtx }) =>
			container.resolve(CreateNewTagInteractor).execute(args, requestCtx),
		updateTag: async (_, args, { requestCtx }) =>
			container.resolve(UpdateTagInteractor).execute(args, requestCtx),
		createContact: async (_, args, { requestCtx }) =>
			container.resolve(CreateContactInteractor).execute(args, requestCtx),
		updateContact: async (_, args, { requestCtx }) =>
			container.resolve(UpdateContactInteractor).execute(args, requestCtx),
		archiveContact: async (_, args, { requestCtx }) =>
			container.resolve(ArchiveContactInteractor).execute(args, requestCtx),
		createService: async (_, args, { requestCtx }) =>
			container.resolve(CreateServiceInteractor).execute(args, requestCtx),
		updateService: async (_, args, { requestCtx }) =>
			container.resolve(UpdateServiceInteractor).execute(args, requestCtx),
		createServiceAnswer: async (_, args, { requestCtx }) =>
			container.resolve(CreateServiceAnswerInteractor).execute(args, requestCtx),
		deleteServiceAnswer: async (_, args, { requestCtx }) =>
			container.resolve(DeleteServiceAnswerInteractor).execute(args, requestCtx),
		updateServiceAnswer: async (_, args, { requestCtx }) =>
			container.resolve(UpdateServiceAnswerInteractor).execute(args, requestCtx)
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
