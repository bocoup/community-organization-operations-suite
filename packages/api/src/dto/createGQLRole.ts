/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Role } from '@cbosuite/schema/dist/provider-types'
import type { DbRole } from '~db/types'

const ROLE_TYPE = 'Role'

export function createGQLRole(role: DbRole): Role {
	return {
		__typename: ROLE_TYPE,
		orgId: role.org_id,
		roleType: role.role_type
	}
}
