/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fakeSpecialists } from '~slices/navigatorsSlice'
import Requester from '~types/Requester'
import FormikAsyncSelect, { OptionType, FormikAsyncSelectProps } from '~ui/FormikAsyncSelect'

const date = new Date()
date.setDate(date.getDate() - 6)
date.setFullYear(date.getFullYear() - 42)

interface SpecialistSelectProps extends FormikAsyncSelectProps {
	name?: string
	placeholder?: string
	error?: string
}

const transformSpecialist = (specialist: Requester): OptionType => {
	return {
		label: `${specialist.firstName} ${specialist.lastName}`,
		value: specialist.id.toString()
	}
}

export default function SpecialistSelect({ name }: SpecialistSelectProps): JSX.Element {
	const defaultOptions = fakeSpecialists.map(transformSpecialist)

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
			placeholder='Search or Create...'
		/>
	)
}
