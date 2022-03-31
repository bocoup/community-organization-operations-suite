/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import type { Contact } from '@cbosuite/schema/dist/client-types'
import type { IPaginatedListColumn } from '~components/ui/PaginatedList'
import type { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { MultiActionButton } from '~components/ui/MultiActionButton2'
import { ContactTitle, getContactTitle } from './ContactTitle'
import { MobileContactCard } from './MobileContactCard'
import { EngagementStatusText, getEngagementStatusText } from './EngagementStatusText'
import { GenderText, getGenderText } from './GenderText'
import { RaceText, getRaceText } from './RaceText'
import { useLocale } from '~hooks/useLocale'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { sortByAlphanumeric, sortByDate } from '~utils/sorting'

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
					return getContactTitle(contact, t)
				}
			},
			{
				key: 'dateOfBirth',
				name: t('viewClient.header.dateOfBirth'),
				className: 'col-2',
				onRenderColumnItem({ dateOfBirth }: Contact) {
					return (
						<span>{dateOfBirth ? new Date(dateOfBirth).toLocaleDateString(locale) : null}</span>
					)
				},
				isSortable: true,
				sortingFunction: sortByDate,
				sortingValue(contact: Contact) {
					return { date: contact.dateOfBirth } // See '~utils/sorting'
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
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return getEngagementStatusText(contact.engagements ?? [], t)
				}
			},
			{
				key: 'gender',
				name: t('demographics.gender.label'),
				className: 'col-2',
				onRenderColumnItem(contact: Contact) {
					return <GenderText gender={contact?.demographics?.gender} />
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return getGenderText(contact?.demographics?.gender ?? null, t)
				}
			},
			{
				key: 'race',
				name: t('demographics.race.label'),
				className: 'col-2',
				onRenderColumnItem(contact: Contact) {
					return <RaceText race={contact?.demographics?.race} />
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return getRaceText(contact?.demographics?.race ?? null, t)
				}
			},
			{
				key: 'actionColumn',
				name: '',
				className: 'col-2 d-flex justify-content-end',
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
