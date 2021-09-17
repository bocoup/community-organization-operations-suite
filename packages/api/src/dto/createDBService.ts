/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceInput } from '@cbosuite/schema/dist/provider-types'
import { v4 as createId } from 'uuid'
import { DbService } from '~db'
import { createDBServiceCustomFields } from './createDBServiceCustomFields'

export function createDBService(service: ServiceInput): DbService {
	return {
		id: createId(),
		org_id: service.orgId,
		name: service.name,
		description: service.description || undefined,
		serviceStatus: service.serviceStatus,
		tags: service.tags || undefined,
		customFields: service?.customFields
			? createDBServiceCustomFields(service.customFields)
			: undefined,
		contactFormEnabled: service?.contactFormEnabled || false
	}
}
