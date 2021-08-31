/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MentionUserInput, StatusType, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { DbMention, UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'

export class MarkMentionSeenInteractor implements Interactor<MentionUserInput, UserResponse> {
	#localization: Localization
	#users: UserCollection

	public constructor(localization: Localization, users: UserCollection) {
		this.#localization = localization
		this.#users = users
	}

	public async execute(body: MentionUserInput): Promise<UserResponse> {
		const { userId, engId: engagementId, markAll, createdAt } = body
		const result = await this.#users.itemById(userId)

		if (!result.item) {
			return {
				user: null,
				message: this.#localization.t('mutation.markMentionSeen.userNotFound'),
				status: StatusType.Failed
			}
		}

		const dbUser = result.item

		dbUser.mentions?.forEach((mention: DbMention) => {
			if (!!markAll) {
				mention.seen = true
			} else if (mention.engagement_id === engagementId && mention.created_at === createdAt) {
				mention.seen = true
			}
		})

		await this.#users.saveItem(dbUser)

		return {
			user: createGQLUser(dbUser),
			message: this.#localization.t('mutation.markMentionSeen.success'),
			status: StatusType.Success
		}
	}
}
