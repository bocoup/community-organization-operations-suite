/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Service } from '@cbosuite/schema/dist/provider-types'
import type { DbService } from '~db'
import { empty } from '~utils/noop'

const SERVICE_TYPE = 'Service'

export function createGQLService(service: DbService): Service {
	return {
		__typename: SERVICE_TYPE,
		id: service.id,
		orgId: service.org_id,
		name: service.name,
		description: service.description,
		tags: (service.tags as any) || empty,
		fields: (service.fields as any) || empty,
		status: service.status,
		contactFormEnabled: service?.contactFormEnabled ? service.contactFormEnabled : false
	}
}
