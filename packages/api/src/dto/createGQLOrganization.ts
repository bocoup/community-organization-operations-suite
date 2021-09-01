/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Organization } from '@cbosuite/schema/dist/provider-types'
import { DbOrganization } from '~db'

export function createGQLOrganization(org: DbOrganization): Organization {
	return {
		__typename: 'Organization',
		description: org.description,
		id: org.id,
		name: org.name,
		tags: org.tags as any,
		// These are just IDs, resolve into user objects in the resolve stack
		users: org.users as any,
		contacts: org.contacts as any,
		attributes: org.attributes as any
	}
}
