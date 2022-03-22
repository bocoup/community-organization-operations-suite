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

export function getContactTitle(contact: Contact, t: (key: string) => string): string {
	const name = contact.name.first + ' ' + contact.name.last
	if (contact?.status === ContactStatus.Archived) {
		return name + ' (' + t('archived') + ')'
	}
	return name
}

export const ContactTitle: FC<{ contact: Contact }> = memo(function ContactTitle({ contact }) {
	const { t } = useTranslation(Namespace.Clients)
	const handleClick = useNavCallback(null, { contact: contact.id })
	return (
		<CardRowTitle
			tag='span'
			title={getContactTitle(contact, t)}
			titleLink='/'
			onClick={handleClick}
		/>
	)
})
