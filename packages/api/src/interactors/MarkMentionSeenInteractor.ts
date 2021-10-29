/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationMarkMentionSeenArgs, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { SuccessUserResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { UserCollection } from '~db/UserCollection'
import { Telemetry } from '~components/Telemetry'
import { DbMention } from '~db/types'

@singleton()
export class MarkMentionSeenInteractor
	implements Interactor<unknown, MutationMarkMentionSeenArgs, UserResponse>
{
	public constructor(
		private localization: Localization,
		private users: UserCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
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
		this.telemetry.trackEvent('MarkMentionSeen')
		return new SuccessUserResponse(
			this.localization.t('mutation.markMentionSeen.success', locale),
			createGQLUser(user, true)
		)
	}
}
