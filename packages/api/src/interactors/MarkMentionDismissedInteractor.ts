/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationMarkMentionDismissedArgs,
	UserResponse
} from '@cbosuite/schema/dist/provider-types'
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
export class MarkMentionDismissedInteractor
	implements Interactor<MutationMarkMentionDismissedArgs, UserResponse>
{
	public constructor(
		private localization: Localization,
		private users: UserCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		{ userId, engagementId, dismissAll, createdAt }: MutationMarkMentionDismissedArgs,
		{ locale }: RequestContext
	): Promise<UserResponse> {
		const { item: user } = await this.users.itemById(userId)

		if (!user) {
			throw new UserInputError(
				this.localization.t('mutation.markMentionDismissed.userNotFound', locale)
			)
		}

		user.mentions?.forEach((mention: DbMention) => {
			if (!!dismissAll) {
				mention.dismissed = true
			} else if (mention.engagement_id === engagementId && mention.created_at === createdAt) {
				mention.dismissed = true
			}
		})

		await this.users.updateItem({ id: user.id }, { $set: { mentions: user.mentions } })
		this.telemetry.trackEvent('MarkMentionDismissed')
		return new SuccessUserResponse(
			this.localization.t('mutation.markMentionDismissed.success', locale),
			createGQLUser(user, true)
		)
	}
}
