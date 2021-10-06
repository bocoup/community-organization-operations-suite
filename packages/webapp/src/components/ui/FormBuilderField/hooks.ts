/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutableRefObject, useCallback, useMemo } from 'react'
import { IDropdownOption } from '@fluentui/react'
import { useTranslation } from '~hooks/useTranslation'
import { FieldRequirement, FieldType } from './types'
import { IFormBuilderFieldProps } from '.'
import { validate } from './validate'

export const fieldTypeDescriptions: Record<FieldType, string> = {
	[FieldType.SingleText]: 'formBuilder.dataTypeOptions.singleText',
	[FieldType.MultilineText]: 'formBuilder.dataTypeOptions.multilineText',
	[FieldType.Number]: 'formBuilder.dataTypeOptions.number',
	[FieldType.Date]: 'formBuilder.dataTypeOptions.date',
	[FieldType.SingleChoice]: 'formBuilder.dataTypeOptions.singleChoice',
	[FieldType.MultiChoice]: 'formBuilder.dataTypeOptions.multiChoice'
}

const fieldRequirementDescriptions: Record<FieldRequirement, string> = {
	[FieldRequirement.Required]: 'formBuilder.fieldRequirementOptions.required',
	[FieldRequirement.Optional]: 'formBuilder.fieldRequirementOptions.optional'
}

export function useFieldTypeOptions(): IDropdownOption[] {
	const { t } = useTranslation('services')
	return useMemo<IDropdownOption[]>(
		() =>
			Object.keys(fieldTypeDescriptions).map((key) => {
				return {
					key,
					text: t(fieldTypeDescriptions[key])
				}
			}),
		[t]
	)
}

export function useFieldRequirementOptions(): IDropdownOption[] {
	const { t } = useTranslation('services')
	return useMemo<IDropdownOption[]>(
		() =>
			Object.keys(fieldRequirementDescriptions).map((key) => {
				return {
					key,
					text: t(fieldRequirementDescriptions[key])
				}
			}),
		[t]
	)
}

export function useFieldGroupValidator(
	errorMessage: MutableRefObject<string>,
	isValidCallback: (valid: boolean) => void
): (field: IFormBuilderFieldProps) => boolean {
	const { t } = useTranslation('services')
	return useCallback(
		(field: IFormBuilderFieldProps) => {
			const [isValid, messageId] = validate(field)
			errorMessage.current = messageId ? t(messageId) : ''
			isValidCallback(isValid)
			return isValid
		},
		[errorMessage, isValidCallback, t]
	)
}
