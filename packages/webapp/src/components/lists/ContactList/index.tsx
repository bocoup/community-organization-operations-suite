/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import { useState, useCallback, useRef, useEffect } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { CardRowTitle } from '~ui/CardRowTitle'
import {
	Contact,
	ContactStatus,
	Engagement,
	EngagementStatus
} from '@cbosuite/schema/dist/client-types'
import { PaginatedList, IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { MultiActionButton, IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useBoolean } from '@fluentui/react-hooks'
import { Panel } from '~components/ui/Panel'
import { EditClientForm } from '~components/forms/EditClientForm'
import { Col, Row } from 'react-bootstrap'
import { useContacts } from '~hooks/api/useContacts'
import { TagBadge } from '~components/ui/TagBadge'
import { useWindowSize } from '~hooks/useWindowSize'
import { UserCardRow } from '~components/ui/UserCardRow'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'
import { noop } from '~utils/noop'
import { navigate } from '~utils/navigate'

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

interface ContactListProps {
	title?: string
	openAddClientForm?: () => void
}

export const ContactList: StandardFC<ContactListProps> = wrap(function ContactList({
	title,
	openAddClientForm = noop
}) {
	const { t } = useTranslation('clients')
	const history = useHistory()
	const { contacts } = useContacts()
	const { isMD } = useWindowSize()
	const [filteredList, setFilteredList] = useState<Contact[]>(
		contacts?.filter((c) => c.status !== ContactStatus.Archived) || []
	)
	const searchText = useRef<string>('')

	const [isEditFormOpen, { setTrue: openEditClientPanel, setFalse: dismissEditClientPanel }] =
		useBoolean(false)

	const [selectedContact, setSelectedContact] = useState<Contact>(null)

	const getRaceText = (contactRace?: string) => {
		if (contactRace && contactRace !== '') {
			return <span>{t(`demographics.race.options.${contactRace}`)}</span>
		}

		return <span className='text-muted'>{t('demographics.notProvided')}</span>
	}

	const getGenderText = (contactGender?: string) => {
		if (contactGender && contactGender !== '') {
			return <span>{t(`demographics.gender.options.${contactGender}`)}</span>
		}

		return <span className='text-muted'>{t('demographics.notProvided')}</span>
	}

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
				return (
					<CardRowTitle
						tag='span'
						title={`${contact.name.first} ${contact.name.last}${
							contact.status === ContactStatus.Archived ? ' (' + t('archived') + ')' : ''
						}`}
						titleLink='/'
						onClick={() => {
							navigate(history, history.location.pathname, { contact: contact.id })
						}}
					/>
				)
			}
		},
		{
			key: 'requests',
			name: t('clientList.columns.requests'),
			onRenderColumnItem(contact: Contact) {
				return <span>{getEngagementsStatusText(contact.engagements, t)}</span>
			}
		},
		{
			key: 'gender',
			name: t('demographics.gender.label'),
			onRenderColumnItem(contact: Contact) {
				return getGenderText(contact?.demographics?.gender)
			}
		},
		{
			key: 'race',
			name: t('demographics.race.label'),
			onRenderColumnItem(contact: Contact) {
				return getRaceText(contact?.demographics?.race)
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
			onRenderColumnItem(contact: Contact, index: number) {
				return (
					<UserCardRow
						key={index}
						title={`${contact.name.first} ${contact.name.last}${
							contact.status === ContactStatus.Archived ? ' (' + t('archived') + ')' : ''
						}`}
						titleLink='/'
						body={
							<Col>
								<Row className='ps-2'>
									<Col>
										<Row>
											<Col className='g-0'>
												<h4>{t('clientList.columns.requests')}</h4>
											</Col>
										</Row>
										<Row>{getEngagementsStatusText(contact.engagements, t)}</Row>
									</Col>
									<Col className={cx('d-flex justify-content-end')}>
										<MultiActionButton columnItem={contact} buttonGroup={columnActionButtons} />
									</Col>
								</Row>
								<Row className='ps-2 pt-3'>
									<Col>
										<Row>
											<Col className='g-0'>
												<h4>{t('demographics.gender.label')}</h4>
											</Col>
										</Row>
										<Row>
											<Col className='g-0'>{getGenderText(contact?.demographics?.gender)}</Col>
										</Row>
									</Col>
									<Col>
										<Row>
											<Col className='g-0'>
												<h4>{t('demographics.race.label')}</h4>
											</Col>
										</Row>
										<Row>
											<Col className='g-0'>{getRaceText(contact?.demographics?.race)}</Col>
										</Row>
									</Col>
								</Row>
								<Row>
									<Col className='pt-3'>
										{contact.tags.map((tag, idx) => {
											return <TagBadge key={idx} tag={{ id: tag.id, label: tag.label }} />
										})}
									</Col>
								</Row>
							</Col>
						}
						onClick={() => {
							navigate(history, history.location.pathname, { contact: contact.id })
						}}
					/>
				)
			}
		}
	]

	return (
		<>
			<div className={cx('mt-5 mb-5')} data-testid='contact-list'>
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
