/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import { Contact, ContactStatus } from '@cbosuite/schema/dist/client-types'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useNavCallback } from '~hooks/useNavCallback'
import { CardRowTitle } from '~ui/CardRowTitle'

export const ContactTitle: FC<{ contact: Contact }> = memo(function ContactTitle({ contact }) {
	const { t } = useTranslation(Namespace.Clients)
	const handleClick = useNavCallback(null, { contact: contact.id })
	return (
		<CardRowTitle
			tag='span'
			title={`${contact.name.first} ${contact.name.last}${
				contact.status === ContactStatus.Archived ? ' (' + t('archived') + ')' : ''
			}`}
			titleLink='/'
			onClick={handleClick}
		/>
	)
})
