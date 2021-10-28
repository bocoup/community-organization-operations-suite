/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { Contact } from '@cbosuite/schema/dist/client-types'
import { IPaginatedListColumn } from '~components/ui/PaginatedList'
import { MultiActionButton, IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { ContactTitle } from './ContactTitle'
import { MobileContactCard } from './MobileContactCard'
import { EngagementStatusText } from './EngagementStatusText'
import { GenderText } from './GenderText'
import { RaceText } from './RaceText'
import { Namespace, useTranslation } from '~hooks/useTranslation'

export function usePageColumns(actions: IMultiActionButtons<Contact>[]): IPaginatedListColumn[] {
	const { t } = useTranslation(Namespace.Clients)
	return useMemo(
		() => [
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
					return <MultiActionButton columnItem={contact} buttonGroup={actions} />
				}
			}
		],
		[t, actions]
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
