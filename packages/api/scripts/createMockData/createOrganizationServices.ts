/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceStatus } from '@cbosuite/schema/dist/provider-types'
import { v4 } from 'uuid'
import { DbService } from '~db/types'

export function createOrganizationServices(orgId: string): DbService[] {
	return defaultServices.map((s) => ({
		...s,
		id: v4(),
		org_id: orgId,
		customFields: s.customFields.map((cf) => ({
			...cf,
			fieldId: v4()
		}))
	}))
}

const defaultServices = [
	{
		name: 'Local Food Delivery',
		serviceStatus: ServiceStatus.Active,
		contactFormEnabled: false,
		customFields: [
			{
				fieldName: 'Allergens',
				fieldType: 'singleText',
				fieldValue: [],
				fieldRequirements: 'optional'
			}
		]
	},
	{
		name: 'Legal Aid',
		serviceStatus: ServiceStatus.Active,
		contactFormEnabled: true,
		customFields: [
			{
				fieldName: 'Citizenship',
				fieldType: 'singleText',
				fieldValue: [],
				fieldRequirements: 'optional'
			}
		]
	}
]
