/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	Service,
	ServiceFieldInput,
	ServiceFieldRequirement,
	ServiceFieldType
} from '@cbosuite/schema/dist/client-types'
import { useCallback, useMemo, useState } from 'react'
import { IFormBuilderFieldProps } from '~components/ui/FormBuilderField'
import { empty } from '~utils/noop'

export interface FormBuilderHelpers {
	fields: IFormBuilderFieldProps[]
	transformValues: (values: any) => Service
	setFields: (fields: IFormBuilderFieldProps[]) => void
	handleAddField: (index: number) => void
	handleDeleteField: (index: number) => void
	handleMoveFieldUp: (index: number) => void
	handleMoveFieldDown: (index: number) => void
}

export function useFormBuilderHelpers(
	initialFormFields: IFormBuilderFieldProps[] = empty,
	orgId = 'preview-org-id'
): FormBuilderHelpers {
	const [fields, setFields] = useState<IFormBuilderFieldProps[]>(initialFormFields)

	const transformValues = useCallback(
		(values: any): Service => {
			return {
				name: values.name,
				orgId: orgId,
				description: values.description,
				tags: values.tags?.map((i) => i.value),
				fields: createFormFieldData(fields),
				contactFormEnabled: values.contactFormEnabled
			} as Service
		},
		[fields, orgId]
	)

	const handleAddField = useCallback(
		(index) => {
			const newFields = [...fields]
			if (index === fields.length - 1) {
				newFields.push({
					label: '',
					inputs: [],
					requirement: ServiceFieldRequirement.Optional,
					type: ServiceFieldType.SingleText
				})
			} else {
				newFields.splice(index + 1, 0, {
					label: '',
					inputs: [],
					requirement: ServiceFieldRequirement.Optional,
					type: ServiceFieldType.SingleText
				})
			}
			setFields(newFields)
		},
		[fields]
	)

	const handleDeleteField = useCallback(
		(index: number) => {
			const newFields = [...fields]
			newFields.splice(index, 1)
			setFields(newFields)
		},
		[fields]
	)

	const handleMoveFieldUp = useCallback(
		(index: number) => {
			if (index > 0 && index <= fields.length - 1) {
				const newFields = [...fields]
				const item = fields[index]
				const swapped = fields[index - 1]
				newFields[index - 1] = item
				newFields[index] = swapped
				setFields(newFields)
			}
		},
		[fields]
	)

	const handleMoveFieldDown = useCallback(
		(index: number) => {
			if (index >= 0 && index < fields.length - 1) {
				const newFields = [...fields]
				const item = fields[index]
				const swapped = fields[index + 1]
				newFields[index + 1] = item
				newFields[index] = swapped
				setFields(newFields)
			}
		},
		[fields]
	)

	return useMemo(
		() => ({
			fields,
			setFields,
			transformValues,
			handleAddField,
			handleDeleteField,
			handleMoveFieldUp,
			handleMoveFieldDown
		}),
		[
			fields,
			transformValues,
			handleAddField,
			handleDeleteField,
			handleMoveFieldUp,
			handleMoveFieldDown
		]
	)
}

function createFormFieldData(fields: IFormBuilderFieldProps[]): ServiceFieldInput[] {
	const custFields: ServiceFieldInput[] = []
	for (const field of fields) {
		if (!!field.label && !!field.type && !!field.requirement) {
			custFields.push({
				name: field.label,
				type: field.type,
				requirement: field.requirement,
				inputs: field?.inputs ? field.inputs.map((fv) => ({ id: fv.id, label: fv.label })) : []
			})
		}
	}
	return custFields
}
