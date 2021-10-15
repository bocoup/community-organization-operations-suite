/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Contact } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import { IFieldFilter } from '../../types'
import { FilterHelper } from '../types'

export function useClientReportFilterHelper(
	setFilterHelper: (arg: { helper: FilterHelper }) => void
) {
	useEffect(
		function populateFilterHelper() {
			setFilterHelper({ helper: clientFilterHelper })
		},
		[setFilterHelper]
	)
}

function clientFilterHelper(filteredContacts: Contact[], filter: IFieldFilter): Contact[] {
	const { id, value } = filter

	let tempList = []
	if (id === 'dateOfBirth') {
		tempList = filteredContacts.filter((contact) => {
			const [_from, _to] = value as string[]
			const from = _from ? new Date(_from) : undefined
			const to = _to ? new Date(_to) : undefined
			const birthdate = new Date(contact.dateOfBirth)
			birthdate.setHours(0, 0, 0, 0)

			return (!from && !to) ||
				(from && to && birthdate >= from && birthdate <= to) ||
				(!from && birthdate <= to) ||
				(from && !to && birthdate >= from)
				? true
				: false
		})
	} else if (id === 'name') {
		const searchStr = value[0]
		if (searchStr === '') {
			return filteredContacts
		}

		tempList = filteredContacts.filter((contact) => {
			const fullName = `${contact.name.first} ${contact.name.last}`
			return fullName.toLowerCase().includes(searchStr.toLowerCase())
		})
	} else if ((['city', 'county', 'state', 'zip'] as string[]).includes(id)) {
		const searchStr = value[0]
		if (searchStr === '') {
			return filteredContacts
		}
		tempList = filteredContacts.filter((contact) => {
			const contactProp = contact?.address?.[id] || ' '
			return contactProp?.toLowerCase().includes(searchStr.toLowerCase())
		})
	} else {
		tempList = filteredContacts.filter((contact) =>
			(value as any[]).includes(contact.demographics[id])
		)
	}
	return tempList
}
