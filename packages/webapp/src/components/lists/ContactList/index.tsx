/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import { useState } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { Contact, ContactStatus } from '@cbosuite/schema/dist/client-types'
import { PaginatedList } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useBoolean } from '@fluentui/react-hooks'
import { Panel } from '~components/ui/Panel'
import { EditClientForm } from '~components/forms/EditClientForm'
import { useContacts } from '~hooks/api/useContacts'
import { useWindowSize } from '~hooks/useWindowSize'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'
import { useContactSearchHandler } from '~hooks/useContactSearchHandler'
import { useMobileColumns, usePageColumns } from './columns'

interface ContactListProps {
	title?: string
	openAddClientForm?: () => void
}

export const ContactList: StandardFC<ContactListProps> = wrap(function ContactList({
	title,
	openAddClientForm = noop
}) {
	const { t } = useTranslation(Namespace.Clients)
	const { contacts } = useContacts()
	const { isMD } = useWindowSize()
	const [filteredList, setFilteredList] = useState<Contact[]>(
		contacts?.filter((c) => c.status !== ContactStatus.Archived) || []
	)
	const [isEditFormOpen, { setTrue: openEditClientPanel, setFalse: dismissEditClientPanel }] =
		useBoolean(false)

	const [selectedContact, setSelectedContact] = useState<Contact>(null)

	const searchList = useContactSearchHandler(contacts, setFilteredList)

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

	const pageColumns = usePageColumns(columnActionButtons)
	const mobileColumns = useMobileColumns(columnActionButtons)

	return (
		<>
			<div className='mt-5 mb-5 contactList'>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={isMD ? 20 : 10}
					hideListHeaders={isMD ? false : true}
					columns={isMD ? pageColumns : mobileColumns}
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
