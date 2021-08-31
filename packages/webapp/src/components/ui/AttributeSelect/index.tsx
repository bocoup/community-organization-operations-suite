/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Attribute } from '@cbosuite/schema/dist/client-types'
import FormikAsyncSelect, { OptionType, FormikAsyncSelectProps } from '~ui/FormikAsyncSelect'
import { useOrganization } from '~hooks/api/useOrganization'

interface AttributeSelectProps extends FormikAsyncSelectProps {
	name?: string
	placeholder?: string
	error?: string
	defaultOptions?: any[]
}

const transformAttributes = (attribute: Attribute): OptionType => {
	return {
		label: attribute.label,
		value: attribute.id.toString()
	}
}

export default function AttributeSelect({
	name,
	defaultOptions,
	placeholder
}: AttributeSelectProps): JSX.Element {
	const { organization } = useOrganization()

	if (!defaultOptions) {
		defaultOptions = organization?.attributes
			?.map(transformAttributes)
			.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1))
	}

	const filterTags = (inputValue: string): OptionType[] => {
		return defaultOptions.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
	}

	const loadOptions = (inputValue: string, callback: (response: OptionType[]) => void) => {
		callback(filterTags(inputValue))
	}

	return (
		<FormikAsyncSelect
			isMulti
			name={name}
			defaultOptions={defaultOptions}
			loadOptions={loadOptions}
			placeholder={placeholder}
		/>
	)
}
