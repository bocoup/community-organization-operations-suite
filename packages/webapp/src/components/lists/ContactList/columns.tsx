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
import { EngagementStatusText, getEngagementStatusText } from './EngagementStatusText'
import { GenderText } from './GenderText'
import { RaceText, getRaceText } from './RaceText'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useLocale } from '~hooks/useLocale'

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
				getValue(contact: Contact) {
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
				getValue(contact: Contact) {
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
				getValue(contact: Contact) {
					// const { t } = useTranslation(Namespace.Clients)
					// return getEngagementStatusText(contact.engagements ?? [], t);
					return null
				}
			},
			{
				key: 'gender',
				name: t('demographics.gender.label'),
				onRenderColumnItem(contact: Contact) {
					return <GenderText gender={contact?.demographics?.gender} />
				},
				getValue(contact: Contact) {
					return contact?.demographics?.gender ?? null
				}
			},
			{
				key: 'race',
				name: t('demographics.race.label'),
				onRenderColumnItem(contact: Contact) {
					return <RaceText race={contact?.demographics?.race} />
				},
				getValue(contact: Contact) {
					// return getRaceText(contact?.demographics?.race ?? null);
					return null
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
