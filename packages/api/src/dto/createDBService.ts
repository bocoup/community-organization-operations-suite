/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceInput } from '@cbosuite/schema/dist/provider-types'
import { v4 as createId } from 'uuid'
import { DbService } from '~db/types'
import { createDBServiceFields } from './createDBServiceFields'

export function createDBService(service: ServiceInput): DbService {
	return {
		id: createId(),
		org_id: service.orgId,
		name: service.name,
		description: service.description || undefined,
		status: service.status,
		tags: service.tags || undefined,
		fields: service?.fields ? createDBServiceFields(service.fields) : undefined,
		contactFormEnabled: service?.contactFormEnabled || false
	}
}
