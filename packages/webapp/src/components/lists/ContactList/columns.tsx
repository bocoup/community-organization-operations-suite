/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { Contact, ContactStatus } from '@cbosuite/schema/dist/client-types'
import { IPaginatedListColumn } from '~components/ui/PaginatedList'
import { MultiActionButton, IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { ContactTitle } from './ContactTitle'
import { MobileContactCard } from './MobileContactCard'
import { EngagementStatusText } from './EngagementStatusText'
import { GenderText } from './GenderText'
import { RaceText } from './RaceText'
import { useLocale } from '~hooks/useLocale'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { sortByAlphanumeric } from '~utils/sortByAlphanumeric'

export function usePageColumns(actions: IMultiActionButtons<Contact>[]): IPaginatedListColumn[] {
	const { t } = useTranslation(Namespace.Clients)
	const [locale] = useLocale()

	return useMemo(
		() => [
			{
				key: 'name',
				name: t('clientList.columns.name'),
				onRenderColumnItem(contact: Contact) {
					return <ContactTitle contact={contact} />
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					const name = contact.name.first + ' ' + contact.name.last
					if (contact?.status === ContactStatus.Archived) {
						return name + ' (' + t('archived') + ')'
					}
					return name
				}
			},
			{
				key: 'dateOfBirth',
				name: t('viewClient.header.dateOfBirth'),
				onRenderColumnItem({ dateOfBirth }: Contact) {
					return (
						<span>{dateOfBirth ? new Date(dateOfBirth).toLocaleDateString(locale) : null}</span>
					)
				},
				isSortable: true,
				sortingValue(contact: Contact) {
					return contact.dateOfBirth
						? new Date(contact.dateOfBirth).toLocaleDateString(locale)
						: null
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
				},
				isSortable: true,
				sortingValue(contact: Contact) {
					return contact.engagements ?? []
				}
			},
			{
				key: 'gender',
				name: t('demographics.gender.label'),
				onRenderColumnItem(contact: Contact) {
					return <GenderText gender={contact?.demographics?.gender} />
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return contact?.demographics?.gender ?? null
				}
			},
			{
				key: 'race',
				name: t('demographics.race.label'),
				onRenderColumnItem(contact: Contact) {
					return <RaceText race={contact?.demographics?.race} />
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return contact?.demographics?.race ?? null
				}
			},
			{
				key: 'actionColumn',
				name: '',
				className: 'w-100 d-flex justify-content-end',
				onRenderColumnItem(contact: Contact) {
					return <MultiActionButton columnItem={contact} buttonGroup={actions} />
				}
			}
		],
		[t, actions, locale]
	)
}

export function useMobileColumns(actions: IMultiActionButtons<Contact>[]): IPaginatedListColumn[] {
	return useMemo(
		() => [
			{
				key: 'cardItem',
				name: 'cardItem',
				onRenderColumnItem(contact: Contact) {
					return <MobileContactCard contact={contact} key={contact.id} actionButtons={actions} />
				}
			}
		],
		[actions]
	)
}
