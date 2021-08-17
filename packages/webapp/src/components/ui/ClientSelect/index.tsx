/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useRecoilValue } from 'recoil'
import FormikAsyncSelect, {
	OptionType,
	FormikAsyncSelectProps
} from '~components/ui/FormikAsyncSelect'
import { organizationState } from '~store'
import type { Contact } from '@cbosuite/schema/lib/client-types'

const date = new Date()
date.setDate(date.getDate() - 6)
date.setFullYear(date.getFullYear() - 42)

interface ClientSelectProps extends FormikAsyncSelectProps {
	name?: string
	placeholder: string
	error?: string
}

const transformClient = (client: Contact): OptionType => {
	return {
		label: `${client.name.first} ${client.name.last}`,
		value: client.id.toString()
	}
}

const ClientSelect = memo(function ClientSelect({
	name,
	placeholder
}: ClientSelectProps): JSX.Element {
	const org = useRecoilValue(organizationState)
	const defaultOptions = org.contacts ? org.contacts.map(transformClient) : []

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
			placeholder={placeholder}
		/>
	)
})
export default ClientSelect
