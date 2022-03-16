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
import { createAuditFields } from '~dto/createAuditFields'

export function createOrganizationServices(orgId: string): DbService[] {
	return defaultServices.map((s) => ({
		...s,
		id: v4(),
		org_id: orgId,
		fields: s.fields.map((cf) => ({
			...cf,
			id: v4(),
			inputs: cf.inputs.map((i) => ({
				...i,
				id: v4()
			}))
		})),
		...createAuditFields('seeder')
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
	},
	{
		name: 'Complex Form',
		status: ServiceStatus.Active,
		contactFormEnabled: true,
		fields: [
			{
				name: 'Nature of Request',
				type: ServiceFieldType.SingleText,
				inputs: [],
				requirement: ServiceFieldRequirement.Required
			},
			{
				name: 'Star Wars Opinions',
				type: ServiceFieldType.MultilineText,
				inputs: [],
				requirement: ServiceFieldRequirement.Required
			},
			{
				name: 'Coolness Rating',
				type: ServiceFieldType.Number,
				inputs: [],
				requirement: ServiceFieldRequirement.Required
			},
			{
				name: 'Next Movie Date',
				type: ServiceFieldType.Date,
				inputs: [],
				requirement: ServiceFieldRequirement.Required
			},
			{
				name: 'Preferred Cereal',
				type: ServiceFieldType.SingleChoice,
				requirement: ServiceFieldRequirement.Required,
				inputs: [
					{
						label: 'Frosted Flakes'
					},
					{
						label: 'Fruit Loops'
					},
					{
						label: 'Cinnamon Toast Crunch'
					}
				]
			},
			{
				name: 'Beans',
				type: ServiceFieldType.MultiChoice,
				requirement: ServiceFieldRequirement.Required,
				inputs: [
					{
						label: 'Garbanzo'
					},
					{
						label: 'Pinto'
					},
					{
						label: 'Black-Eyed'
					},
					{
						label: 'Kidney'
					}
				]
			}
		]
	}
]
