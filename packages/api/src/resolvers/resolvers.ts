/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IResolvers } from '@graphql-tools/utils'
import { Resolvers } from '@cbosuite/schema/dist/provider-types'
import { Long } from './Long'
import { container, InjectionToken } from 'tsyringe'
import { GetOrganizationsInteractor } from '~interactors/query/GetOrganizationsInteractor'
import { GetOrganizationInteractor } from '~interactors/query/GetOrganizationInteractor'
import { GetUserInteractor } from '~interactors/query/GetUserInteractor'
import { GetContactInteractor } from '~interactors/query/GetContactInteractor'
import { GetContactsInteractor } from '~interactors/query/GetContactsInteractor'
import { GetEngagementInteractor } from '~interactors/query/GetEngagementInteractor'
import { GetActiveEngagementsInteractor } from '~interactors/query/GetActiveEngagementsInteractor'
import { GetInactiveEngagementsInteractor } from '~interactors/query/GetInactiveEngagementsInteractor'
import { ExportDataInteractor } from '~interactors/query/ExportDataInteractor'
import { GetServicesInteractor } from '~interactors/query/GetServicesInteractor'
import { GetServicesAnswersInteractor } from '~interactors/query/GetServiceAnswersInteractor'
import { AuthenticateInteractor } from '~interactors/mutation/AuthenticateInteractor'
import { CreateEngagementInteractor } from '~interactors/mutation/CreateEngagementInteractor'
import { UpdateEngagementInteractor } from '~interactors/mutation/UpdateEngagementInteractor'
import { AssignEngagementInteractor } from '~interactors/mutation/AssignEngagementInteractor'
import { CompleteEngagementInteractor } from '~interactors/mutation/CompleteEngagementInteractor'
import { SetEngagementStatusInteractor } from '~interactors/mutation/SetEngagementStatusInteractor'
import { AddEngagementActionInteractor } from '~interactors/mutation/AddEngagementActionInteractor'
import { InitiatePasswordResetInteractor } from '~interactors/mutation/InitiatePasswordReset'
import { ExecutePasswordResetInteractor } from '~interactors/mutation/ExecutePasswordResetInteractor'
import { ResetUserPasswordInteractor } from '~interactors/mutation/ResetUserPasswordInteractor'
import { SetUserPasswordInteractor } from '~interactors/mutation/SetUserPasswordInteractor'
import { CreateNewUserInteractor } from '~interactors/mutation/CreateNewUserInteractor'
import { UpdateUserInteractor } from '~interactors/mutation/UpdateUserInteractor'
import { DeleteUserInteractor } from '~interactors/mutation/DeleteUserInteractor'
import { UpdateUserFCMTokenInteractor } from '~interactors/mutation/UpdateUserFCMTokenInteractor'
import { MarkMentionSeenInteractor } from '~interactors/mutation/MarkMentionSeenInteractor'
import { MarkMentionDismissedInteractor } from '~interactors/mutation/MarkMentionDismissedInteractor'
import { CreateNewTagInteractor } from '~interactors/mutation/CreateNewTagInteractor'
import { UpdateTagInteractor } from '~interactors/mutation/UpdateTagInteractor'
import { CreateContactInteractor } from '~interactors/mutation/CreateContactInteractor'
import { UpdateServiceAnswerInteractor } from '~interactors/mutation/UpdateServiceAnswerInteractor'
import { DeleteServiceAnswerInteractor } from '~interactors/mutation/DeleteServiceAnswerInteractor'
import { CreateServiceAnswerInteractor } from '~interactors/mutation/CreateServiceAnswerInteractor'
import { UpdateServiceInteractor } from '~interactors/mutation/UpdateServiceInteractor'
import { CreateServiceInteractor } from '~interactors/mutation/CreateServiceInteractor'
import { ArchiveContactInteractor } from '~interactors/mutation/ArchiveContactInteractor'
import { UpdateContactInteractor } from '~interactors/mutation/UpdateContactInteractor'
import { Interactor, RequestContext } from '~types'
import { ResolveActionUserInteractor } from '~interactors/fields/ResolveActionUserInteractor'
import { ResolveActionTaggedUserInteractor } from '~interactors/fields/ResolveActionTaggedUserInteractor'
import { ResolveActionTagsInteractor } from '~interactors/fields/ResolveActionTagsInteractor'
import { ResolveContactEngagementsInteractor } from '~interactors/fields/ResolveContactEngagementsInteractor'
import { ResolveContactTagsInteractor } from '~interactors/fields/ResolveContactTagsInteractor'
import { ResolveEngagementUserInteractor } from '~interactors/fields/ResolveEngagementUserInteractor'
import { ResolveEngagementContactsInteractor } from '~interactors/fields/ResolveEngagementContactsInteractor'
import { ResolveEngagementTagsInteractor } from '~interactors/fields/ResolveEngagementTagsInteractor'
import { ResolveEngagementCountsActiveInteractor } from '~interactors/fields/ResolveEngagementCountsActiveInteractor'
import { ResolveEngagementCountsClosedInteractor } from '~interactors/fields/ResolveEngagementCountsClosedInteractor'
import { ResolveMentionEngagementInteractor } from '~interactors/fields/ResolveMentionEngagementInteractor'
import { ResolveMentionCreatedByInteractor } from '~interactors/fields/ResolveMentionCreatedByInteractor'
import { ResolveOrganizationUsersInteractor } from '~interactors/fields/ResolveOrganizationUsersInteractor'
import { ResolveOrganizationContactsInteractor } from '~interactors/fields/ResolveOrganizationContactsInteractor'
import { ResolveOrganizationTagsInteractor } from '~interactors/fields/ResolveOrganizationTagsInteractor'
import { ResolveServiceTagsInteractor } from '~interactors/fields/ResolveServiceTagsInteractor'
import { ResolveServiceAnswerContactsInteractor } from '~interactors/fields/ResolveServiceAnswerContactsInteractor'
import { ResolveTagUsageCountServiceEntriesInteractor } from '~interactors/fields/ResolveTagUsageCountServiceEntriesInteractor'
import { ResolveTagUsageCountEngagementsInteractor } from '~interactors/fields/ResolveTagCountEngagementsInteractor'
import { ResolveTagUsageCountClientsInteractor } from '~interactors/fields/ResolveTagUsageCountClientsInteractor'
import { ResolveTagUsageCountTotalInteractor } from '~interactors/fields/ResolveTagUsageCountTotalInteractor'
import { SubscribeToMentionsInteractor } from '~interactors/subscription/SubscribeToMentionsInteractor'
import { SubscribeToEngagementsInteractor } from '~interactors/subscription/SubscribeToEngagementsInteractor'
import { identity } from '~utils/functions'

export const resolvers: Resolvers<RequestContext> & IResolvers<any, RequestContext> = {
	Long,
	Subscription: {
		mentions: {
			subscribe: use(SubscribeToMentionsInteractor),
			resolve: identity
		},
		engagements: {
			subscribe: use(SubscribeToEngagementsInteractor),
			resolve: identity
		}
	},
	Query: {
		organizations: use(GetOrganizationsInteractor),
		organization: use(GetOrganizationInteractor),
		user: use(GetUserInteractor),
		contact: use(GetContactInteractor),
		contacts: use(GetContactsInteractor),
		engagement: use(GetEngagementInteractor),
		activeEngagements: use(GetActiveEngagementsInteractor),
		inactiveEngagements: use(GetInactiveEngagementsInteractor),
		exportData: use(ExportDataInteractor),
		services: use(GetServicesInteractor),
		serviceAnswers: use(GetServicesAnswersInteractor)
	},
	Mutation: {
		authenticate: use(AuthenticateInteractor),
		createEngagement: use(CreateEngagementInteractor),
		updateEngagement: use(UpdateEngagementInteractor),
		assignEngagement: use(AssignEngagementInteractor),
		completeEngagement: use(CompleteEngagementInteractor),
		setEngagementStatus: use(SetEngagementStatusInteractor),
		addEngagementAction: use(AddEngagementActionInteractor),
		initiatePasswordReset: use(InitiatePasswordResetInteractor),
		executePasswordReset: use(ExecutePasswordResetInteractor),
		resetUserPassword: use(ResetUserPasswordInteractor),
		setUserPassword: use(SetUserPasswordInteractor),
		createNewUser: use(CreateNewUserInteractor),
		updateUser: use(UpdateUserInteractor),
		deleteUser: use(DeleteUserInteractor),
		updateUserFCMToken: use(UpdateUserFCMTokenInteractor),
		markMentionSeen: use(MarkMentionSeenInteractor),
		markMentionDismissed: use(MarkMentionDismissedInteractor),
		createNewTag: use(CreateNewTagInteractor),
		updateTag: use(UpdateTagInteractor),
		createContact: use(CreateContactInteractor),
		updateContact: use(UpdateContactInteractor),
		archiveContact: use(ArchiveContactInteractor),
		createService: use(CreateServiceInteractor),
		updateService: use(UpdateServiceInteractor),
		createServiceAnswer: use(CreateServiceAnswerInteractor),
		deleteServiceAnswer: use(DeleteServiceAnswerInteractor),
		updateServiceAnswer: use(UpdateServiceAnswerInteractor)
	},
	Action: {
		user: use(ResolveActionUserInteractor),
		taggedUser: use(ResolveActionTaggedUserInteractor),
		tags: use(ResolveActionTagsInteractor)
	},
	Contact: {
		engagements: use(ResolveContactEngagementsInteractor),
		tags: use(ResolveContactTagsInteractor)
	},
	Engagement: {
		user: use(ResolveEngagementUserInteractor),
		contacts: use(ResolveEngagementContactsInteractor),
		tags: use(ResolveEngagementTagsInteractor)
	},
	EngagementCounts: {
		active: use(ResolveEngagementCountsActiveInteractor),
		closed: use(ResolveEngagementCountsClosedInteractor)
	},
	Mention: {
		engagement: use(ResolveMentionEngagementInteractor),
		createdBy: use(ResolveMentionCreatedByInteractor)
	},
	Organization: {
		users: use(ResolveOrganizationUsersInteractor),
		contacts: use(ResolveOrganizationContactsInteractor),
		tags: use(ResolveOrganizationTagsInteractor)
	},
	Service: {
		tags: use(ResolveServiceTagsInteractor)
	},
	ServiceAnswer: {
		contacts: use(ResolveServiceAnswerContactsInteractor)
	},
	TagUsageCount: {
		serviceEntries: use(ResolveTagUsageCountServiceEntriesInteractor),
		engagements: use(ResolveTagUsageCountEngagementsInteractor),
		clients: use(ResolveTagUsageCountClientsInteractor),
		total: use(ResolveTagUsageCountTotalInteractor)
	}
}

function use<Self, Args, Result>(tok: InjectionToken<Interactor<Self, Args, Result>>) {
	return (self: Self, args: Args, ctx: RequestContext): Promise<Result> =>
		container.resolve(tok).execute(self, args, ctx)
}
