/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import { ContactPanel } from '~ui/ContactPanel'
import { useFlyoutDismisser } from './hooks'
import type { FlyoutProps } from './types'

export const ContactFlyout: FC<FlyoutProps & { contact?: string }> = memo(function ContactFlyout({
	isOpen,
	setIsOpen,
	contact
}) {
	const handleDismiss = useFlyoutDismisser('contact', setIsOpen)
	return (
		<ContactPanel
			openPanel={isOpen}
			onDismiss={handleDismiss}
			contactId={contact ? (contact as string) : undefined}
		/>
	)
})
