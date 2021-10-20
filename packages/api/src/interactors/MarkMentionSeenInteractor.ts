/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationMarkMentionSeenArgs, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { DbMention, UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'
import { FailedResponse, SuccessUserResponse } from '~utils/response'

export class MarkMentionSeenInteractor
	implements Interactor<MutationMarkMentionSeenArgs, UserResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly users: UserCollection
	) {}

	public async execute({
		userId,
		engagementId,
		markAll,
		createdAt
	}: MutationMarkMentionSeenArgs): Promise<UserResponse> {
		const result = await this.users.itemById(userId)

		if (!result.item) {
			return new FailedResponse(this.localization.t('mutation.markMentionSeen.userNotFound'))
		}

		const dbUser = result.item

		dbUser.mentions?.forEach((mention: DbMention) => {
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

		await this.users.saveItem(dbUser)

		return new SuccessUserResponse(
			this.localization.t('mutation.markMentionSeen.success'),
			createGQLUser(dbUser, true)
		)
	}
}
