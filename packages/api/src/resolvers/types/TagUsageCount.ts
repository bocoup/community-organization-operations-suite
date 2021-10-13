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
	services: (_: TagUsageCountType, args, context) => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return context.collections.services.count({
			org_id: { $eq: org_id },
			tags: { $eq: tag_id }
		})
	},
	engagements: (_: TagUsageCountType, args, context) => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return context.collections.engagements.count({
			org_id: { $eq: org_id },
			tags: { $eq: tag_id }
		})
	},
	clients: (_: TagUsageCountType, args, context) => {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return context.collections.contacts.count({
			org_id: { $eq: org_id },
			tags: { $eq: tag_id }
		})
	}
}
