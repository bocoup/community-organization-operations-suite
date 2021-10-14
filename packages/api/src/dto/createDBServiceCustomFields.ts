/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceCustomFieldInput } from '@cbosuite/schema/dist/provider-types'
import { v4 as createId } from 'uuid'
import { DbServiceField } from '~db'

export function createDBServiceCustomFields(
	customFields: ServiceCustomFieldInput[] | DbServiceField[]
): DbServiceField[] {
	return (
		customFields?.map((field) => ({
			fieldId: field.fieldId || createId(),
			fieldName: field.fieldName,
			fieldValue:
				field?.fieldValue?.map((value) => ({
					id: value.id || createId(),
					label: value.label
				})) || undefined,
			fieldType: field.fieldType,
			fieldRequirements: field.fieldRequirements
		})) || undefined
	)
}
