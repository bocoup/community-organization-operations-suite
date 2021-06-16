/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import type ComponentProps from '~types/ComponentProps'
import CardRowTitle from '~ui/CardRowTitle'
import { Contact, Engagement } from '@greenlight/schema/lib/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import { useContacts } from '~hooks/api/useContact'
import ClientOnly from '~components/ui/ClientOnly'
import cx from 'classnames'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useBoolean } from '@fluentui/react-hooks'
import Panel from '~components/ui/Panel'
import AddClientForm from '~components/forms/AddClientForm'
import EditClientForm from '~components/forms/EditClientForm'
import ContactPanel from '~components/ui/ContactPanel'
import ContactHeader from '~components/ui/ContactHeader'

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
	if (openCount === 0 && completeCount === 0) {
		text = '0 Requests'
	}
	return text
}

interface ContactListProps extends ComponentProps {
	title?: string
}

export default function ContactList({ title }: ContactListProps): JSX.Element {
	const { data: contacts, refetch } = useContacts()
	const [filteredList, setFilteredList] = useState<Contact[]>(contacts || [])
	const searchText = useRef<string>('')

	const [isOpen, { setTrue: openClientPanel, setFalse: dismissClientPanel }] = useBoolean(false)

	const [
		isNewFormOpen,
		{ setTrue: openNewClientPanel, setFalse: dismissNewClientPanel }
	] = useBoolean(false)

	const [
		isEditFormOpen,
		{ setTrue: openEditClientPanel, setFalse: dismissEditClientPanel }
	] = useBoolean(false)

	const [selectedContact, setSelectedContact] = useState<Contact>(null)

	useEffect(() => {
		if (contacts) {
			const sortedList = Object.values(contacts).sort((a, b) =>
				a.name.first > b.name.first ? 1 : -1
			)
			if (searchText.current === '') {
				setFilteredList(sortedList)
			} else {
				const searchStr = searchText.current
				const filteredUsers = sortedList.filter(
					(contact: Contact) =>
						contact.name.first.toLowerCase().indexOf(searchStr) > -1 ||
						contact.name.last.toLowerCase().indexOf(searchStr) > -1
				)
				setFilteredList(filteredUsers)
			}
		}
	}, [contacts, setFilteredList, searchText])

	const searchList = useCallback(
		(searchStr: string) => {
			if (searchStr === '') {
				setFilteredList(contacts)
			} else {
				const filteredUsers = contacts.filter(
					(contact: Contact) =>
						contact.name.first.toLowerCase().indexOf(searchStr) > -1 ||
						contact.name.last.toLowerCase().indexOf(searchStr) > -1
				)
				setFilteredList(filteredUsers)
			}

			searchText.current = searchStr
		},
		[contacts, searchText]
	)

	const onPanelClose = async () => {
		dismissNewClientPanel()
		dismissEditClientPanel()
		await refetch({})
	}

	const columnActionButtons: IMultiActionButtons<Contact>[] = [
		{
			name: 'Edit',
			className: cx(styles.editButton),
			onActionClick: function onActionClick(contact: Contact) {
				setSelectedContact(contact)
				openEditClientPanel()
			}
		}
	]

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: 'Name',
			onRenderColumnItem: function onRenderColumnItem(contact: Contact) {
				return (
					<CardRowTitle
						tag='span'
						title={`${contact.name.first} ${contact.name.last}`}
						titleLink='/'
						onClick={() => {
							setSelectedContact(contact)
							openClientPanel()
						}}
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
			key: 'actionColumn',
			name: '',
			className: 'w-100 d-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(contact: Contact) {
				return <MultiActionButton columnItem={contact} buttonGroup={columnActionButtons} />
			}
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5')}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={20}
					columns={pageColumns}
					rowClassName='align-items-center'
					addButtonName='Add Client'
					onSearchValueChange={value => searchList(value)}
					onListAddButtonClick={() => openNewClientPanel()}
				/>
			</div>
			<Panel openPanel={isNewFormOpen} onDismiss={() => onPanelClose()}>
				<AddClientForm title='Add Client' closeForm={() => onPanelClose()} />
			</Panel>
			<Panel openPanel={isEditFormOpen} onDismiss={() => onPanelClose()}>
				<EditClientForm
					title='Edit Client'
					contact={selectedContact}
					closeForm={() => onPanelClose()}
				/>
			</Panel>
			<ContactPanel openPanel={isOpen} onDismiss={() => dismissClientPanel()}>
				<ContactHeader contact={selectedContact} />
			</ContactPanel>
		</ClientOnly>
	)
}
