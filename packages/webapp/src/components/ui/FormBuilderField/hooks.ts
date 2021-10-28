/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutableRefObject, useCallback, useMemo } from 'react'
import { IDropdownOption } from '@fluentui/react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { IFormBuilderFieldProps } from '.'
import { validate } from './validate'
import { ServiceFieldRequirement, ServiceFieldType } from '@cbosuite/schema/dist/client-types'

export const fieldTypeDescriptions: Record<ServiceFieldType, string> = {
	[ServiceFieldType.SingleText]: 'formBuilder.dataTypeOptions.singleText',
	[ServiceFieldType.MultilineText]: 'formBuilder.dataTypeOptions.multilineText',
	[ServiceFieldType.Number]: 'formBuilder.dataTypeOptions.number',
	[ServiceFieldType.Date]: 'formBuilder.dataTypeOptions.date',
	[ServiceFieldType.SingleChoice]: 'formBuilder.dataTypeOptions.singleChoice',
	[ServiceFieldType.MultiChoice]: 'formBuilder.dataTypeOptions.multiChoice'
}

const fieldRequirementDescriptions: Record<ServiceFieldRequirement, string> = {
	[ServiceFieldRequirement.Required]: 'formBuilder.fieldRequirementOptions.required',
	[ServiceFieldRequirement.Optional]: 'formBuilder.fieldRequirementOptions.optional'
}

export function useFieldTypeOptions(): IDropdownOption[] {
	const { t } = useTranslation(Namespace.Services)
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
	const { t } = useTranslation(Namespace.Services)
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
	const { t } = useTranslation(Namespace.Services)
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
