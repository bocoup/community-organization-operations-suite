/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact } from '@cbosuite/schema/dist/client-types'
import type { FC } from 'react'
import { memo } from 'react'
import { CardRowTitle } from '~components/ui/CardRowTitle'
import { useNavCallback } from '~hooks/useNavCallback'

export const EngagementContact: FC<{ contact: Contact }> = memo(function EngagementContact({
	contact
}) {
	const handleClick = useNavCallback(null, { contact: contact.id })
	return (
		<CardRowTitle
			tag='span'
			title={`${contact.name.first} ${contact.name.last}`}
			titleLink='/'
			onClick={handleClick}
		/>
	)
})
