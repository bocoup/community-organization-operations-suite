/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fakeSpecialists } from '~slices/navigatorsSlice'
import type { Tag } from '@greenlight/schema/lib/client-types'
import Requester from '~types/Requester'
import FormikAsyncSelect, { OptionType, FormikAsyncSelectProps } from '~ui/FormikAsyncSelect'
import { useAuthUser } from '~hooks/api/useAuth'
import { useOrganization } from '~hooks/api/useOrganization'
import { get } from 'lodash'

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

export default function TagSelect({
	name,
	defaultOptions,
	placeholder
}: TagSelectProps): JSX.Element {
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)

	console.log('orgData?.tags', orgData?.tags)

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
}
