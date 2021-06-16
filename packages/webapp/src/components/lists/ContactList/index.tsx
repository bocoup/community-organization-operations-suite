/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { useState, useCallback, useRef, useEffect } from 'react'
import CardRowTitle from '~ui/CardRowTitle'
import { Contact, Engagement } from '@greenlight/schema/lib/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import { useContacts } from '~hooks/api/useContact'

const getOpenEngagementsCount = (engagements: Engagement[] = []) => {
	const openEngagements = engagements.filter(eng => eng.status !== 'CLOSED')
	return openEngagements.length
}

const getCompleteEngagementsCount = (engagements: Engagement[] = []) => {
	const completeEngagements = engagements.filter(eng => eng.status === 'CLOSED')
	return completeEngagements.length
}

const getEngagementsStatusText = (engagements: Engagement[] = []) => {
	let text = ''
	const completeCount = getCompleteEngagementsCount(engagements)
	const openCount = getOpenEngagementsCount(engagements)
	if (completeCount > 0) {
		text += `${completeCount} Completed`
	}
	if (openCount > 0) {
		if (completeCount > 0) text += ', '
		text += `${openCount} Open`
	}
	return text
}

function ContactList() {
	const { data } = useContacts()
	const contacts = data || []
	// const [filteredList, setFilteredList] = useState<Contact[]>(contacts || [])
	// console.log('filteredList',filteredList)
	// const searchText = useRef<string>('')

	// useEffect(() => {
	// 	if (searchText.current === '') {
	// 		setFilteredList(contacts)
	// 	} else {
	// 		const searchStr = searchText.current
	// 		const filteredUsers = contacts.filter(
	// 			(contact: Contact) =>
	// 				contact.name.first.toLowerCase().indexOf(searchStr) > -1 ||
	// 				contact.name.last.toLowerCase().indexOf(searchStr) > -1
	// 		)
	// 		setFilteredList(filteredUsers)
	// 	}
	// }, [contacts, setFilteredList, searchText])

	// const searchList = useCallback(
	// 	(searchStr: string) => {
	// 		if (searchStr === '') {
	// 			setFilteredList(contacts)
	// 		} else {
	// 			const filteredUsers = contacts.filter(
	// 				(contact: Contact) =>
	// 					contact.name.first.toLowerCase().indexOf(searchStr) > -1 ||
	// 					contact.name.last.toLowerCase().indexOf(searchStr) > -1
	// 			)
	// 			setFilteredList(filteredUsers)
	// 		}

	// 		searchText.current = searchStr
	// 	},
	// 	[contacts, searchText]
	// )

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: 'Name',
			fieldName: ['name.first', ' ', 'name.last'],
			onRenderColumnItem: function onRenderColumnItem(contact: Contact) {
				return (
					<CardRowTitle
						tag='span'
						title={`${contact.name.first} ${contact.name.last}`}
						titleLink='/'
						// onClick={() => openSpecialistDetails(user)}
					/>
				)
			}
		},
		{
			key: 'requests',
			name: 'Requests',
			onRenderColumnItem: function onRenderColumnItem(contact: Contact) {
				return <span>{getEngagementsStatusText(contact.engagements)}</span>
			}
		},
		{
			key: 'identifiers',
			name: 'Identifiers',
			onRenderColumnItem: function onRenderColumnItem(contact: Contact) {
				return null
				// TODO add identifiers
			}
		}
	]
	return (
		<PaginatedList
			title='Clients'
			list={contacts}
			itemsPerPage={20}
			columns={pageColumns}
			rowClassName='align-items-center'
			addButtonName='Add Client'
			// onSearchValueChange={value => searchList(value)}
			onListAddButtonClick={() => console.log('add client')}
		/>
	)
}

export default ContactList
