/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	TagUsageCount as TagUsageCountType,
	TagUsageCountResolvers
} from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'

export const TagUsageCount: TagUsageCountResolvers<AppContext> = {
	serviceEntries: async (_: TagUsageCountType, args, context) => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return countServiceEntries(org_id, tag_id, context)
	},
	engagements: (_: TagUsageCountType, args, context) => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return countEngagements(org_id, tag_id, context)
	},
	clients: (_: TagUsageCountType, args, context) => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return countClients(org_id, tag_id, context)
	},
	total: async (_, _args, context): Promise<number> => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		const counts = await Promise.all([
			countServiceEntries(org_id, tag_id, context),
			countEngagements(org_id, tag_id, context),
			countClients(org_id, tag_id, context)
		])
		return counts.reduce((acc, val) => acc + val, 0)
	}
}

async function countServiceEntries(orgId: string, tagId: string, context: AppContext) {
	// this is nasty, we should store answers in a new collection
	const services = await context.collections.services.items(
		{},
		{ org_id: { $eq: orgId }, tags: { $eq: tagId } }
	)
	let total = 0
	for (const service of services.items) {
		total += await context.collections.serviceAnswers.count({
			service_id: { $eq: service.id }
		})
	}
	return total
}

function countEngagements(orgId: string, tagId: string, context: AppContext) {
	return context.collections.engagements.count({
		org_id: { $eq: orgId },
		tags: { $eq: tagId }
	})
}

function countClients(orgId: string, tagId: string, context: AppContext) {
	return context.collections.contacts.count({
		org_id: { $eq: orgId },
		tags: { $eq: tagId }
	})
}
