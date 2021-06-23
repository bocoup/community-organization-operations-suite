/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import React, { useState, useCallback, useRef, useEffect, memo } from 'react'
import type ComponentProps from '~types/ComponentProps'
import CardRowTitle from '~ui/CardRowTitle'
import { Contact, Engagement } from '@greenlight/schema/lib/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import ClientOnly from '~components/ui/ClientOnly'
import cx from 'classnames'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useBoolean } from '@fluentui/react-hooks'
import Panel from '~components/ui/Panel'
import AddClientForm from '~components/forms/AddClientForm'
import EditClientForm from '~components/forms/EditClientForm'
import ContactPanel from '~components/ui/ContactPanel'
import ContactHeader from '~components/ui/ContactHeader'
import { Col, Row } from 'react-bootstrap'
import { getTimeDuration } from '~utils/getTimeDuration'
import { useContacts } from '~hooks/api/useContacts'

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

const ContactList = memo(function ContactList({ title }: ContactListProps): JSX.Element {
	const { contacts } = useContacts()
	const [filteredList, setFilteredList] = useState<Contact[]>(contacts || [])
	const searchText = useRef<string>('')

	const [isOpen, { setTrue: openClientPanel, setFalse: dismissClientPanel }] = useBoolean(false)

	const [isNewFormOpen, { setTrue: openNewClientPanel, setFalse: dismissNewClientPanel }] =
		useBoolean(false)

	const [isEditFormOpen, { setTrue: openEditClientPanel, setFalse: dismissEditClientPanel }] =
		useBoolean(false)

	const [selectedContact, setSelectedContact] = useState<Contact>(null)

	useEffect(() => {
		if (contacts) {
			if (searchText.current === '') {
				setFilteredList(contacts)
			} else {
				const searchStr = searchText.current
				const filteredUsers = contacts.filter(
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
			if (contacts) {
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
			}
		},
		[contacts, searchText]
	)

	const onPanelClose = async () => {
		dismissNewClientPanel()
		dismissEditClientPanel()
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
				<div className={cx(styles.contactDetailsWrapper)}>
					<div className='mb-3 mb-lg-5'>
						<h3 className='mb-2 mb-lg-4 '>
							<strong>Requests Created</strong>
						</h3>
						{selectedContact?.engagements?.length > 0 ? (
							selectedContact?.engagements.map((e: Engagement, idx: number) => {
								return (
									<Col key={idx} className={cx(styles.requestsCreatedBox)}>
										<Row className='mb-4'>
											<Col>
												<strong>Status:</strong> {e.user ? 'Assigned' : 'Not Started'}
											</Col>
											{e.user ? (
												<Col>
													<strong>Assigned to: </strong>
													<span className='text-primary'>@{e.user.userName}</span>
												</Col>
											) : (
												<Col></Col>
											)}
										</Row>
										<Row className='mb-4'>
											<Col>{e.description}</Col>
										</Row>
										<Row>
											<Col>
												<strong>Time Remaining: </strong>
												{getTimeDuration(e.startDate, e.endDate)}
											</Col>
										</Row>
									</Col>
								)
							})
						) : (
							<div>No requests available for this contact.</div>
						)}
					</div>
				</div>
			</ContactPanel>
		</ClientOnly>
	)
})
export default ContactList