/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationCompleteEngagementArgs,
	EngagementResponse,
	EngagementStatus
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization } from '~components'
import { Publisher } from '~components/Publisher'
import { EngagementCollection } from '~db'
import { createDBAction, createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'
import { SuccessEngagementResponse } from '~utils/response'

export class CompleteEngagementInteractor
	implements Interactor<MutationCompleteEngagementArgs, EngagementResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly engagements: EngagementCollection,
		private readonly publisher: Publisher
	) {}

	public async execute(
		{ engagementId: id }: MutationCompleteEngagementArgs,
		{ identity, locale }: RequestContext
	): Promise<EngagementResponse> {
		if (!identity) {
			throw new UserInputError(
				this.localization.t('mutation.completeEngagement.unauthorized', locale)
			)
		}

		const engagement = await this.engagements.itemById(id)
		if (!engagement.item) {
			throw new UserInputError(
				this.localization.t('mutation.completeEngagement.requestNotFound', locale)
			)
		}

		// Set status
		await this.engagements.updateItem({ id }, { $set: { status: EngagementStatus.Completed } })
		engagement.item.status = EngagementStatus.Completed

		// Publish changes to websocketk connection
		await this.publisher.publishEngagementCompleted(
			engagement.item.org_id,
			createGQLEngagement(engagement.item),
			locale
		)

		// Create action
		const currentUserId = identity.id
		const nextAction = createDBAction({
			comment: this.localization.t('mutation.completeEngagement.actions.markComplete', locale),
			orgId: engagement.item.org_id,
			userId: currentUserId,
			taggedUserId: currentUserId
		})

		await this.engagements.updateItem({ id }, { $push: { actions: nextAction } })
		engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)

		return new SuccessEngagementResponse(
			this.localization.t('mutation.completeEngagement.success', locale),
			createGQLEngagement(engagement.item)
		)
	}
}
