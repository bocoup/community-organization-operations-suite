/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IResolvers } from '@graphql-tools/utils'
import { EngagementResponse, MentionEvent, Resolvers } from '@cbosuite/schema/dist/provider-types'
import { Long } from './Long'
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
import { ResolveActionUserInteractor } from '~interactors/ResolveActionUserInteractor'
import { ResolveActionTaggedUserInteractor } from '~interactors/ResolveActionTaggedUserInteractor'
import { ResolveActionTagsInteractor } from '~interactors/ResolveActionTagsInteractor'
import { ResolveContactEngagementsInteractor } from '~interactors/ResolveContactEngagementsInteractor'
import { ResolveContactTagsInteractor } from '~interactors/ResolveContactTagsInteractor'
import { ResolveEngagementUserInteractor } from '~interactors/ResolveEngagementUserInteractor'
import { ResolveEngagementContactsInteractor } from '~interactors/ResolveEngagementContactsInteractor'
import { ResolveEngagementTagsInteractor } from '~interactors/ResolveEngagementTagsInteractor'
import { ResolveEngagementCountsActiveInteractor } from '~interactors/ResolveEngagementCountsActiveInteractor'
import { ResolveEngagementCountsClosedInteractor } from '~interactors/ResolveEngagementCountsClosedInteractor'
import { ResolveMentionEngagementInteractor } from '~interactors/ResolveMentionEngagementInteractor'
import { ResolveMentionCreatedByInteractor } from '~interactors/ResolveMentionCreatedByInteractor'
import { ResolveOrganizationUsersInteractor } from '~interactors/ResolveOrganizationUsersInteractor'
import { ResolveOrganizationContactsInteractor } from '~interactors/ResolveOrganizationContactsInteractor'
import { ResolveOrganizationTagsInteractor } from '~interactors/ResolveOrganizationTagsInteractor'
import { ResolveServiceTagsInteractor } from '~interactors/ResolveServiceTagsInteractor'
import { ResolveServiceAnswerContactsInteractor } from '~interactors/ResolveServiceAnswerContactsInteractor'
import { ResolveTagUsageCountServiceEntriesInteractor } from '~interactors/ResolveTagUsageCountServiceEntriesInteractor'
import { ResolveTagUsageCountEngagementsInteractor } from '~interactors/ResolveTagCountEngagementsInteractor'
import { ResolveTagUsageCountClientsInteractor } from '~interactors/ResolveTagUsageCountClientsInteractor'
import { ResolveTagUsageCountTotalInteractor } from '~interactors/ResolveTagUsageCountTotalInteractor'

export const resolvers: Resolvers<RequestContext> & IResolvers<any, RequestContext> = {
	Long,
	Subscription: {
		mentions: {
			subscribe: (_, { userId }) => container.resolve(Publisher).subscribeToMentions(userId),
			resolve: (payload: MentionEvent) => payload
		},
		engagements: {
			subscribe: (_, { orgId }) => container.resolve(Publisher).subscribeToEngagements(orgId),
			resolve: (payload: EngagementResponse) => payload
		}
	},
	Query: {
		organizations: resolver(GetOrganizationsInteractor),
		organization: resolver(GetOrganizationInteractor),
		user: resolver(GetUserInteractor),
		contact: resolver(GetContactInteractor),
		contacts: resolver(GetContactsInteractor),
		engagement: resolver(GetEngagementInteractor),
		activeEngagements: resolver(GetActiveEngagementsInteractor),
		inactiveEngagements: resolver(GetInactiveEngagementsInteractor),
		exportData: resolver(ExportDataInteractor),
		services: resolver(GetServicesInteractor),
		serviceAnswers: resolver(GetServicesAnswersInteractor)
	},
	Mutation: {
		authenticate: resolver(AuthenticateInteractor),
		createEngagement: resolver(CreateEngagementInteractor),
		updateEngagement: resolver(UpdateEngagementInteractor),
		assignEngagement: resolver(AssignEngagementInteractor),
		completeEngagement: resolver(CompleteEngagementInteractor),
		setEngagementStatus: resolver(SetEngagementStatusInteractor),
		addEngagementAction: resolver(AddEngagementActionInteractor),
		initiatePasswordReset: resolver(InitiatePasswordResetInteractor),
		executePasswordReset: resolver(ExecutePasswordResetInteractor),
		resetUserPassword: resolver(ResetUserPasswordInteractor),
		setUserPassword: resolver(SetUserPasswordInteractor),
		createNewUser: resolver(CreateNewUserInteractor),
		updateUser: resolver(UpdateUserInteractor),
		deleteUser: resolver(DeleteUserInteractor),
		updateUserFCMToken: resolver(UpdateUserFCMTokenInteractor),
		markMentionSeen: resolver(MarkMentionSeenInteractor),
		markMentionDismissed: resolver(MarkMentionDismissedInteractor),
		createNewTag: resolver(CreateNewTagInteractor),
		updateTag: resolver(UpdateTagInteractor),
		createContact: resolver(CreateContactInteractor),
		updateContact: resolver(UpdateContactInteractor),
		archiveContact: resolver(ArchiveContactInteractor),
		createService: resolver(CreateServiceInteractor),
		updateService: resolver(UpdateServiceInteractor),
		createServiceAnswer: resolver(CreateServiceAnswerInteractor),
		deleteServiceAnswer: resolver(DeleteServiceAnswerInteractor),
		updateServiceAnswer: resolver(UpdateServiceAnswerInteractor)
	},
	Action: {
		user: resolver(ResolveActionUserInteractor),
		taggedUser: resolver(ResolveActionTaggedUserInteractor),
		tags: resolver(ResolveActionTagsInteractor)
	},
	Contact: {
		engagements: resolver(ResolveContactEngagementsInteractor),
		tags: resolver(ResolveContactTagsInteractor)
	},
	Engagement: {
		user: resolver(ResolveEngagementUserInteractor),
		contacts: resolver(ResolveEngagementContactsInteractor),
		tags: resolver(ResolveEngagementTagsInteractor)
	},
	EngagementCounts: {
		active: resolver(ResolveEngagementCountsActiveInteractor),
		closed: resolver(ResolveEngagementCountsClosedInteractor)
	},
	Mention: {
		engagement: resolver(ResolveMentionEngagementInteractor),
		createdBy: resolver(ResolveMentionCreatedByInteractor)
	},
	Organization: {
		users: resolver(ResolveOrganizationUsersInteractor),
		contacts: resolver(ResolveOrganizationContactsInteractor),
		tags: resolver(ResolveOrganizationTagsInteractor)
	},
	Service: {
		tags: resolver(ResolveServiceTagsInteractor)
	},
	ServiceAnswer: {
		contacts: resolver(ResolveServiceAnswerContactsInteractor)
	},
	TagUsageCount: {
		serviceEntries: resolver(ResolveTagUsageCountServiceEntriesInteractor),
		engagements: resolver(ResolveTagUsageCountEngagementsInteractor),
		clients: resolver(ResolveTagUsageCountClientsInteractor),
		total: resolver(ResolveTagUsageCountTotalInteractor)
	}
}

function resolver<Self, Args, Result>(tok: InjectionToken<Interactor<Self, Args, Result>>) {
	return (self: Self, args: Args, ctx: RequestContext): Promise<Result> =>
		container.resolve(tok).execute(self, args, ctx)
}
