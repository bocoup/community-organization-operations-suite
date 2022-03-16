/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TagCategory } from '@cbosuite/schema/dist/provider-types'
import { v4 } from 'uuid'
import { DbTag } from '../../src/db/types'
import { createAuditFields } from '../../src/dto/createAuditFields'

export function createOrganizationTags(orgId: string): DbTag[] {
	return defaultOrganizationTags.map((t) => ({
		...t,
		id: v4(),
		org_id: orgId,
		...createAuditFields('seeder')
	}))
}

const defaultOrganizationTags = [
	{
		label: 'Food',
		description: '',
		category: TagCategory.Sdoh
	},
	{
		label: 'Housing',
		description: '',
		category: TagCategory.Sdoh
	},
	{
		label: 'Transportation',
		description: '',
		category: TagCategory.Sdoh
	},
	{
		label: 'Interpersonal Safety',
		description: '',
		category: TagCategory.Sdoh
	},
	{
		label: 'Immediate Need',
		description: '',
		category: TagCategory.Sdoh
	}
]
