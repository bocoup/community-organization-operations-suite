/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Tag } from '@resolve/schema/lib/client-types'
import FormikAsyncSelect, { OptionType, FormikAsyncSelectProps } from '~ui/FormikAsyncSelect'
import { useAuthUser } from '~hooks/api/useAuth'
import { useOrganization } from '~hooks/api/useOrganization'
import { get } from 'lodash'
import { memo } from 'react'

interface TagSelectProps extends FormikAsyncSelectProps {
	name?: string
	placeholder?: string
	error?: string
	defaultOptions?: any[]
}

const transformTags = (tag: Tag): OptionType => {
	return {
		label: tag.label,
		value: tag.id.toString()
	}
}

const TagSelect = memo(function TagSelect({
	name,
	defaultOptions,
	placeholder
}: TagSelectProps): JSX.Element {
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)

	if (!defaultOptions) {
		defaultOptions = orgData?.tags?.map(transformTags)
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
})
export default TagSelect
