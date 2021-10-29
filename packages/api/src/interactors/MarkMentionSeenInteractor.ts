/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationMarkMentionSeenArgs, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization } from '~components'
import { DbMention, UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { SuccessUserResponse } from '~utils/response'
import { defaultClient as appInsights } from 'applicationinsights'

export class MarkMentionSeenInteractor
	implements Interactor<MutationMarkMentionSeenArgs, UserResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly users: UserCollection
	) {}

	public async execute(
		{ userId, engagementId, markAll, createdAt }: MutationMarkMentionSeenArgs,
		{ locale }: RequestContext
	): Promise<UserResponse> {
		const { item: user } = await this.users.itemById(userId)

		if (!user) {
			throw new UserInputError(this.localization.t('mutation.markMentionSeen.userNotFound', locale))
		}

		user.mentions?.forEach((mention: DbMention) => {
			if (!!markAll) {
				mention.seen = true
			} else if (
				engagementId != null &&
				mention.engagement_id === engagementId &&
				mention.created_at === createdAt
			) {
				mention.seen = true
			}
		})

		await this.users.updateItem({ id: user.id }, { $set: { mentions: user.mentions } })
		appInsights.trackEvent({ name: 'MarkMentionSeen' })
		return new SuccessUserResponse(
			this.localization.t('mutation.markMentionSeen.success', locale),
			createGQLUser(user, true)
		)
	}
}
