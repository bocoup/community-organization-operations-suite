/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Role } from '@community-organization-operations-suite/schema/lib/provider-types'
import type { DbRole } from '~db'

export function createGQLRole(role: DbRole): Role {
	return {
		__typename: 'Role',
		orgId: role.org_id,
		roleType: role.role_type
	}
}
