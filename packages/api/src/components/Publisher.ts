/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	Engagement,
	EngagementStatus,
	Mention,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { PubSub } from 'graphql-subscriptions'
import { Localization } from '~components'

export class Publisher {
	public constructor(
		private readonly pubsub: PubSub,
		private readonly localization: Localization
	) {}

	public publishMention(userId: string, mention: Mention): Promise<void> {
		return this.pubsub.publish(mentionChannel(userId), {
			action: 'CREATED',
			message: this.localization.t('mutation.addEngagementAction.success'),
			mention,
			status: StatusType.Success
		})
	}

	public publishEngagementAssigned(orgId: string, engagement: Engagement): Promise<void> {
		return this.pubsub.publish(engagementChannel(orgId), {
			action: 'UPDATE',
			message: this.localization.t('mutation.assignEngagement.success'),
			engagement,
			status: StatusType.Success
		})
	}

	public publishEngagementCompleted(orgId: string, engagement: Engagement): Promise<void> {
		return this.pubsub.publish(engagementChannel(orgId), {
			action: 'COMPLETED',
			message: this.localization.t('mutation.completeEngagement.success'),
			engagement,
			status: StatusType.Success
		})
	}

	public publishEngagementCreated(orgId: string, engagement: Engagement): Promise<void> {
		return this.pubsub.publish(engagementChannel(orgId), {
			action: 'CREATED',
			message: this.localization.t('mutation.createEngagement.success'),
			engagement,
			status: StatusType.Success
		})
	}

	public publishEngagementClosed(orgId: string, engagement: Engagement): Promise<void> {
		return this.pubsub.publish(engagementChannel(orgId), {
			action: EngagementStatus.Closed,
			message: this.localization.t('mutation.setEngagementStatus.success'),
			engagement,
			status: StatusType.Success
		})
	}

	public publishEngagementUpdated(orgId: string, engagement: Engagement): Promise<void> {
		return this.pubsub.publish(engagementChannel(orgId), {
			action: 'UPDATED',
			message: this.localization.t('mutation.updateEngagement.success'),
			engagement,
			status: StatusType.Success
		})
	}
}

const mentionChannel = (userId: string): string => `USER_MENTION_UPDATES_${userId}`
const engagementChannel = (orgId: string): string => `ORG_ENGAGEMENT_UPDATES_${orgId}`