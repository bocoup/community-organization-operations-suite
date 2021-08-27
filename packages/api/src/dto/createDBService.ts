/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceInput } from '@cbosuite/schema/lib/provider-types'
import { v4 as createId } from 'uuid'
import { DbService } from '~db'

export function createDBService(service: ServiceInput): DbService {
	return {
		id: createId(),
		org_id: service.orgId,
		name: service.name,
		description: service.description || undefined,
		serviceStatus: service.serviceStatus,
		tags: service.tags || undefined,
		customFields:
			service?.customFields?.map((field) => ({
				fieldName: field.fieldName,
				fieldValue: field?.fieldValue || undefined,
				fieldType: field.fieldType,
				fieldRequirements: field.fieldRequirements
			})) || undefined
	}
}
