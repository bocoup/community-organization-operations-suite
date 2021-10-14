/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ServiceFieldRequirement,
	ServiceFieldType,
	ServiceStatus
} from '@cbosuite/schema/dist/provider-types'
import { v4 } from 'uuid'
import { DbService } from '../../src/db/types'

export function createOrganizationServices(orgId: string): DbService[] {
	return defaultServices.map((s) => ({
		...s,
		id: v4(),
		org_id: orgId,
		fields: s.fields.map((cf) => ({
			...cf,
			id: v4()
		}))
	}))
}

const defaultServices = [
	{
		name: 'Local Food Delivery',
		status: ServiceStatus.Active,
		contactFormEnabled: false,
		fields: [
			{
				name: 'Allergens',
				type: ServiceFieldType.SingleText,
				inputs: [],
				requirement: ServiceFieldRequirement.Optional
			}
		]
	},
	{
		name: 'Legal Aid',
		status: ServiceStatus.Active,
		contactFormEnabled: true,
		fields: [
			{
				name: 'Citizenship',
				type: ServiceFieldType.SingleText,
				inputs: [],
				requirement: ServiceFieldRequirement.Required
			}
		]
	}
]
