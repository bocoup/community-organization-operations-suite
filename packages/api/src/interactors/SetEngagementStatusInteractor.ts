/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	EngagementResponse,
	EngagementStatus,
	MutationSetEngagementStatusArgs
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization } from '~components'
import { Publisher } from '~components/Publisher'
import { EngagementCollection } from '~db'
import { createDBAction, createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'
import { SuccessEngagementResponse } from '~utils/response'
import { defaultClient as appInsights } from 'applicationinsights'

export class SetEngagementStatusInteractor
	implements Interactor<MutationSetEngagementStatusArgs, EngagementResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly engagements: EngagementCollection,
		private readonly publisher: Publisher
	) {}

	public async execute(
		{ engagementId: id, status }: MutationSetEngagementStatusArgs,
		{ identity, locale }: RequestContext
	) {
		const engagement = await this.engagements.itemById(id)
		if (!engagement.item) {
			throw new UserInputError(
				this.localization.t('mutation.setEngagementStatus.requestNotFound', locale)
			)
		}

		// Set status
		await this.engagements.updateItem({ id }, { $set: { status } })
		engagement.item.status = status

		if (status === EngagementStatus.Closed) {
			// Create action
			const currentUserId = identity?.id
			if (currentUserId) {
				const nextAction = createDBAction({
					comment: this.localization.t('mutation.setEngagementStatus.actions.markComplete', locale),
					orgId: engagement.item.org_id,
					userId: currentUserId,
					taggedUserId: currentUserId
				})

				await this.engagements.updateItem({ id }, { $push: { actions: nextAction } })
				engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)
			}

			// Publish changes to websocketk connection
			await this.publisher.publishEngagementClosed(
				engagement.item.org_id,
				createGQLEngagement(engagement.item),
				locale
			)
		}

		appInsights.trackEvent({ name: 'SetEngagementStatus' })
		return new SuccessEngagementResponse(
			this.localization.t('mutation.setEngagementStatus.success', locale),
			createGQLEngagement(engagement.item)
		)
	}
}
