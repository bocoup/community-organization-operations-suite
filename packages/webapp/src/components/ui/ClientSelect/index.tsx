/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import FormikAsyncSelect, {
	OptionType,
	FormikAsyncSelectProps
} from '~components/ui/FormikAsyncSelect'
import { fakeRequests } from '~slices/requestsSlice'
import Requester from '~types/Requester'

const date = new Date()
date.setDate(date.getDate() - 6)
date.setFullYear(date.getFullYear() - 42)

const fakeClients: Requester[] = fakeRequests.map(request => request.requester)

interface ClientSelectProps extends FormikAsyncSelectProps {
	name?: string
	placeholder?: string
	error?: string
}

const transformClient = (client: Requester): OptionType => {
	return {
		label: `${client.name.first} ${client.name.last}`,
		value: client.id.toString()
	}
}

export default function ClientSelect({ name, placeholder }: ClientSelectProps): JSX.Element {
	const defaultOptions = fakeClients.map(transformClient)

	const filterClients = (inputValue: string): Record<string, any>[] => {
		return defaultOptions.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()))
	}

	const loadOptions = (inputValue: string, callback: (response: Record<string, any>[]) => void) => {
		callback(filterClients(inputValue))
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
