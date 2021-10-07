/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import { useState, useCallback, useRef, useEffect } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { Contact, ContactStatus } from '@cbosuite/schema/dist/client-types'
import { PaginatedList, IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { MultiActionButton, IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useBoolean } from '@fluentui/react-hooks'
import { Panel } from '~components/ui/Panel'
import { EditClientForm } from '~components/forms/EditClientForm'
import { useContacts } from '~hooks/api/useContacts'
import { useWindowSize } from '~hooks/useWindowSize'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'
import { ContactTitle } from './ContactTitle'
import { MobileContactCard } from './MobileContactCard'
import { EngagementStatusText } from './EngagementStatusText'
import { GenderText } from './GenderText'
import { RaceText } from './RaceText'

interface ContactListProps {
	title?: string
	openAddClientForm?: () => void
}

export const ContactList: StandardFC<ContactListProps> = wrap(function ContactList({
	title,
	openAddClientForm = noop
}) {
	const { t } = useTranslation('clients')
	const { contacts } = useContacts()
	const { isMD } = useWindowSize()
	const [filteredList, setFilteredList] = useState<Contact[]>(
		contacts?.filter((c) => c.status !== ContactStatus.Archived) || []
	)
	const searchText = useRef<string>('')

	const [isEditFormOpen, { setTrue: openEditClientPanel, setFalse: dismissEditClientPanel }] =
		useBoolean(false)

	const [selectedContact, setSelectedContact] = useState<Contact>(null)

	useEffect(() => {
		if (contacts) {
			const preFilteredContacts = contacts?.filter((c) => c.status !== ContactStatus.Archived) || []

			if (searchText.current === '') {
				setFilteredList(preFilteredContacts)
			} else {
				const searchStr = searchText.current
				const filteredUsers = preFilteredContacts.filter(
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
				const preFilteredContacts =
					contacts?.filter((c) => c.status !== ContactStatus.Archived) || []

				if (searchStr === '') {
					setFilteredList(preFilteredContacts)
				} else {
					const filteredUsers = preFilteredContacts.filter(
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
			onActionClick(contact: Contact) {
				setSelectedContact(contact)
				openEditClientPanel()
			}
		}
	]

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: t('clientList.columns.name'),
			onRenderColumnItem(contact: Contact) {
				return <ContactTitle contact={contact} />
			}
		},
		{
			key: 'requests',
			name: t('clientList.columns.requests'),
			onRenderColumnItem(contact: Contact) {
				return (
					<span>
						<EngagementStatusText engagements={contact.engagements} />
					</span>
				)
			}
		},
		{
			key: 'gender',
			name: t('demographics.gender.label'),
			onRenderColumnItem(contact: Contact) {
				return <GenderText gender={contact?.demographics?.gender} />
			}
		},
		{
			key: 'race',
			name: t('demographics.race.label'),
			onRenderColumnItem(contact: Contact) {
				return <RaceText race={contact?.demographics?.race} />
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'w-100 d-flex justify-content-end',
			onRenderColumnItem(contact: Contact) {
				return <MultiActionButton columnItem={contact} buttonGroup={columnActionButtons} />
			}
		}
	]

	const mobileColumn: IPaginatedListColumn[] = [
		{
			key: 'cardItem',
			name: 'cardItem',
			onRenderColumnItem(contact: Contact) {
				return (
					<MobileContactCard
						contact={contact}
						key={contact.id}
						actionButtons={columnActionButtons}
					/>
				)
			}
		}
	]

	return (
		<>
			<div className={cx('mt-5 mb-5', 'contactList')}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={isMD ? 20 : 10}
					hideListHeaders={isMD ? false : true}
					columns={isMD ? pageColumns : mobileColumn}
					rowClassName='align-items-center'
					addButtonName={t('clientAddButton')}
					onSearchValueChange={searchList}
					onListAddButtonClick={openAddClientForm}
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={onPanelClose}>
				<EditClientForm
					title={t('clientEditButton')}
					contact={selectedContact}
					closeForm={onPanelClose}
				/>
			</Panel>
		</>
	)
})
