/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import React, { useState, useCallback, useRef, useEffect, memo } from 'react'
import type ComponentProps from '~types/ComponentProps'
import CardRowTitle from '~ui/CardRowTitle'
import { Contact, Engagement, EngagementStatus } from '@cbosuite/schema/dist/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import ClientOnly from '~components/ui/ClientOnly'
import cx from 'classnames'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useBoolean } from '@fluentui/react-hooks'
import Panel from '~components/ui/Panel'
import EditClientForm from '~components/forms/EditClientForm'
import { Col, Row } from 'react-bootstrap'
import { useContacts } from '~hooks/api/useContacts'
import TagBadge from '~components/ui/TagBadge'
import useWindowSize from '~hooks/useWindowSize'
import UserCardRow from '~components/ui/UserCardRow'
import { useTranslation } from '~hooks/useTranslation'
import { useRouter } from 'next/router'
import { wrap } from '~utils/appinsights'

const getOpenEngagementsCount = (engagements: Engagement[] = []) => {
	const openEngagements = engagements.filter((eng) => eng.status !== EngagementStatus.Closed)
	return openEngagements.length
}

const getCompleteEngagementsCount = (engagements: Engagement[] = []) => {
	const completeEngagements = engagements.filter((eng) => eng.status === EngagementStatus.Closed)
	return completeEngagements.length
}

const getEngagementsStatusText = (engagements: Engagement[] = [], t: any) => {
	let text = ''
	const completeCount = getCompleteEngagementsCount(engagements)
	const openCount = getOpenEngagementsCount(engagements)
	if (completeCount > 0) {
		text += `${completeCount} ${t('clientStatus.completed')}`
	}
	if (openCount > 0) {
		if (completeCount > 0) text += ', '
		text += `${openCount} ${t('clientStatus.open')}`
	}
	if (openCount === 0 && completeCount === 0) {
		text = `0 ${t('clientStatus.requests')}`
	}
	return text
}

interface ContactListProps extends ComponentProps {
	title?: string
	openAddClientForm?: () => void
}

const ContactList = memo(function ContactList({
	title,
	openAddClientForm
}: ContactListProps): JSX.Element {
	const { t } = useTranslation('clients')
	const router = useRouter()
	const { contacts } = useContacts()
	const { isMD } = useWindowSize()
	const [filteredList, setFilteredList] = useState<Contact[]>(contacts || [])
	const searchText = useRef<string>('')

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
		dismissEditClientPanel()
	}

	const columnActionButtons: IMultiActionButtons<Contact>[] = [
		{
			name: t('clientList.rowActions.edit'),
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
			name: t('clientList.columns.name'),
			onRenderColumnItem: function onRenderColumnItem(contact: Contact) {
				return (
					<CardRowTitle
						tag='span'
						title={`${contact.name.first} ${contact.name.last}`}
						titleLink='/'
						onClick={() => {
							router.push(`${router.pathname}?contact=${contact.id}`, undefined, { shallow: true })
						}}
					/>
				)
			}
		},
		{
			key: 'requests',
			name: t('clientList.columns.requests'),
			onRenderColumnItem: function onRenderColumnItem(contact: Contact) {
				return <span>{getEngagementsStatusText(contact.engagements, t)}</span>
			}
		},
		{
			key: 'attributes',
			name: t('clientList.columns.attributes'),
			onRenderColumnItem: function onRenderColumnItem(contact: Contact) {
				if (contact?.attributes) {
					return contact.attributes.map((attr, idx) => {
						return <TagBadge key={idx} tag={{ id: attr.id, label: attr.label }} />
					})
				}

				return <></>
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

	const mobileColumn: IPaginatedListColumn[] = [
		{
			key: 'cardItem',
			name: 'cardItem',
			onRenderColumnItem: function onRenderColumnItem(contact: Contact, index: number) {
				return (
					<UserCardRow
						key={index}
						title={`${contact.name.first} ${contact.name.last}`}
						titleLink='/'
						body={
							<Col>
								<Row className='ps-2'>
									<Col>
										<Row>{t('clientList.columns.requests')}</Row>
										<Row>{getEngagementsStatusText(contact.engagements, t)}</Row>
									</Col>
									<Col className={cx('d-flex justify-content-end')}>
										<MultiActionButton columnItem={contact} buttonGroup={columnActionButtons} />
									</Col>
								</Row>
								<Row>
									<Col className='pt-3'>
										{contact.attributes.map((attr, idx) => {
											return <TagBadge key={idx} tag={{ id: attr.id, label: attr.label }} />
										})}
									</Col>
								</Row>
							</Col>
						}
						onClick={() => {
							router.push(`${router.pathname}?contact=${contact.id}`, undefined, { shallow: true })
						}}
					/>
				)
			}
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5')}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={isMD ? 20 : 10}
					hideListHeaders={isMD ? false : true}
					columns={isMD ? pageColumns : mobileColumn}
					rowClassName='align-items-center'
					addButtonName={t('clientAddButton')}
					onSearchValueChange={(value) => searchList(value)}
					onListAddButtonClick={() => openAddClientForm?.()}
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={() => onPanelClose()}>
				<EditClientForm
					title={t('clientEditButton')}
					contact={selectedContact}
					closeForm={() => onPanelClose()}
				/>
			</Panel>
		</ClientOnly>
	)
})
export default wrap(ContactList)
