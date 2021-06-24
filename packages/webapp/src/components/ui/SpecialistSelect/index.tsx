/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useRecoilValue } from 'recoil'
import { organizationState } from '~store'
import Requester from '~types/Requester'
import FormikAsyncSelect, { OptionType, FormikAsyncSelectProps } from '~ui/FormikAsyncSelect'

interface SpecialistSelectProps extends FormikAsyncSelectProps {
	name?: string
	placeholder?: string
	error?: string
	defaultOptions?: any[]
}

const transformSpecialist = (specialist: Requester): OptionType => {
	return {
		label: `${specialist.name.first} ${specialist.name.last}`,
		value: specialist.id.toString()
	}
}

const SpecialistSelect = memo(function SpecialistSelect({
	name,
	placeholder
}: SpecialistSelectProps): JSX.Element {
	const org = useRecoilValue(organizationState)
	const defaultOptions = org.users ? org.users.map(transformSpecialist) : []

	const filterSpecialists = (inputValue: string): Record<string, any>[] => {
		return defaultOptions.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()))
	}

	const loadOptions = (inputValue: string, callback: (response: Record<string, any>[]) => void) => {
		callback(filterSpecialists(inputValue))
	}

	return (
		<FormikAsyncSelect
			name={name}
			defaultOptions={defaultOptions}
			loadOptions={loadOptions}
			placeholder={placeholder}
		/>
	)
})
export default SpecialistSelect
