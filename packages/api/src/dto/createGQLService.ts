/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Service } from '@cbosuite/schema/lib/provider-types'
import type { DbService } from '~db'

export function createGQLService(service: DbService): Service {
	return {
		__typename: 'Service',
		id: service.id,
		orgId: service.org_id,
		name: service.name,
		description: service.description,
		tags: service.tags as any,
		customFields: service.customFields,
		serviceStatus: service.serviceStatus,
		contactFormEnabled: service?.contactFormEnabled ? service.contactFormEnabled : false,
		contacts: service.contacts as any
	}
}
