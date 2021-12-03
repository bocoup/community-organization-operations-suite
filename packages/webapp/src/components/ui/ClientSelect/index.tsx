/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useRecoilValue } from 'recoil'
import {
	FormikAsyncSelect,
	OptionType,
	FormikAsyncSelectProps
} from '~components/ui/FormikAsyncSelect'
import { organizationState } from '~store'
import { Contact, ContactStatus } from '@cbosuite/schema/dist/client-types'
import { StandardFC } from '~types/StandardFC'

interface ClientSelectProps extends FormikAsyncSelectProps {
	name?: string
	placeholder: string
	error?: string
	errorClassName?: string
}

function transformClient(client: Contact): OptionType {
	return {
		label: `${client.name.first} ${client.name.last}`,
		value: client.id.toString()
	}
}

export const ClientSelect: StandardFC<ClientSelectProps> = memo(function ClientSelect({
	name,
	placeholder,
	errorClassName
}) {
	const org = useRecoilValue(organizationState)
	const defaultOptions = org?.contacts
		? org.contacts.filter((c) => c.status !== ContactStatus.Archived).map(transformClient)
		: []

	const filterClients = (inputValue: string): Record<string, any>[] => {
		return defaultOptions.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
	}

	const loadOptions = (inputValue: string, callback: (response: Record<string, any>[]) => void) => {
		callback(filterClients(inputValue))
	}

	return (
		<FormikAsyncSelect
			isMulti
			name={name}
			defaultOptions={defaultOptions}
			loadOptions={loadOptions}
			placeholder={placeholder}
			errorClassName={errorClassName}
		/>
	)
})
