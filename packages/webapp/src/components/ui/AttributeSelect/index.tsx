/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Attribute } from '@greenlight/schema/lib/client-types'
import FormikAsyncSelect, { OptionType, FormikAsyncSelectProps } from '~ui/FormikAsyncSelect'
import { useAuthUser } from '~hooks/api/useAuth'
import { useOrganization } from '~hooks/api/useOrganization'
import { get } from 'lodash'

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
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)

	if (!defaultOptions) {
		defaultOptions = orgData?.attributes?.map(transformAttributes)
	}

	const filterTags = (inputValue: string): OptionType[] => {
		return defaultOptions.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()))
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
