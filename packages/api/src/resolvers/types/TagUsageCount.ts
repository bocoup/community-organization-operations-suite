/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	TagUsageCount as TagUsageCountType,
	TagUsageCountResolvers
} from '@cbosuite/schema/dist/provider-types'
import { container } from 'tsyringe'
import { ContactCollection } from '~db/ContactCollection'
import { EngagementCollection } from '~db/EngagementCollection'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { ServiceCollection } from '~db/ServiceCollection'
import { RequestContext } from '~types'

export const TagUsageCount: TagUsageCountResolvers<RequestContext> = {
	serviceEntries: async (_: TagUsageCountType) => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return countServiceEntries(org_id, tag_id)
	},
	engagements: (_: TagUsageCountType) => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return countEngagements(org_id, tag_id)
	},
	clients: (_: TagUsageCountType) => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return countClients(org_id, tag_id)
	},
	total: async (_): Promise<number> => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		const counts = await Promise.all([
			countServiceEntries(org_id, tag_id),
			countEngagements(org_id, tag_id),
			countClients(org_id, tag_id)
		])
		return counts.reduce((acc, val) => acc + val, 0)
	}
}

async function countServiceEntries(orgId: string, tagId: string) {
	const services = container.resolve(ServiceCollection)
	const serviceAnswers = container.resolve(ServiceAnswerCollection)

	// this is nasty, we should store answers in a new collection
	const { items: result } = await services.items(
		{},
		{ org_id: { $eq: orgId }, tags: { $eq: tagId } }
	)
	let total = 0
	for (const service of result) {
		total += await serviceAnswers.count({
			service_id: { $eq: service.id }
		})
	}
	return total
}

function countEngagements(orgId: string, tagId: string) {
	const engagements = container.resolve(EngagementCollection)
	return engagements.count({
		org_id: { $eq: orgId },
		tags: { $eq: tagId }
	})
}

function countClients(orgId: string, tagId: string) {
	const contacts = container.resolve(ContactCollection)
	return contacts.count({
		org_id: { $eq: orgId },
		tags: { $eq: tagId }
	})
}
