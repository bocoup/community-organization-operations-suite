/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Service } from '@cbosuite/schema/dist/provider-types'
import type { DbService } from '~db'

export function createGQLService(service: DbService): Service {
	return {
		__typename: 'Service',
		id: service.id,
		orgId: service.org_id,
		name: service.name,
		description: service.description,
		tags: (service.tags as any) || [],
		fields: (service.fields as any) || [],
		status: service.status,
		contactFormEnabled: service?.contactFormEnabled ? service.contactFormEnabled : false
	}
}
