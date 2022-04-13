/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import type { Contact } from '@cbosuite/schema/dist/client-types'
import { ContactStatus } from '@cbosuite/schema/dist/client-types'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useNavCallback } from '~hooks/useNavCallback'
import { CardRowTitle } from '~ui/CardRowTitle'

export enum ContactName {
	First,
	Last,
	Full
}

export function getContactTitle(
	contact: Contact,
	t: (key: string) => string,
	name: ContactName
): string {
	const { first, last } = contact.name
	const isArchived = contact?.status === ContactStatus.Archived

	switch (name) {
		case ContactName.First:
			return first

		case ContactName.Last:
			return isArchived ? `${last} (${t('archived')})` : last

		case ContactName.Full:
		default:
			const fullname = `${first} ${last}`
			return isArchived ? `${fullname} (${t('archived')})` : fullname
	}
}

export const ContactTitle: FC<{ contact: Contact; name?: ContactName }> = memo(
	function ContactTitle({ contact, name }) {
		const { t } = useTranslation(Namespace.Clients)
		const handleClick = useNavCallback(null, { contact: contact.id })
		return (
			<CardRowTitle
				tag='span'
				title={getContactTitle(contact, t, name)}
				titleLink='/'
				onClick={handleClick}
			/>
		)
	}
)
