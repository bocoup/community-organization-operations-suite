/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ServiceFieldInput } from '@cbosuite/schema/dist/provider-types'
import { v4 as createId } from 'uuid'
import type { DbServiceField } from '~db/types'

export function createDBServiceFields(
	customFields: ServiceFieldInput[] | DbServiceField[]
): DbServiceField[] {
	return (
		customFields?.map((field) => ({
			id: field.id || createId(),
			name: field.name,
			inputs:
				field?.inputs?.map((value) => ({
					id: value.id || createId(),
					label: value.label
				})) || undefined,
			type: field.type,
			requirement: field.requirement
		})) || undefined
	)
}
