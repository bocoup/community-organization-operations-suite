/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import { ContactFlyout } from './ContactFlyout'
import { RequestFlyout } from './RequestFlyout'
import { SpecialistFlyout } from './SpecialistFlyout'
import { NotificationFlyout } from './NotificationFlyout'
import { useFlyoutPanelsState } from './hooks'

export const FlyoutPanels: FC = memo(function FlyoutPanels() {
	const {
		engagement,
		specialist,
		contact,
		requestOpen,
		specialistOpen,
		contactOpen,
		notificationsOpen,
		setRequestOpen,
		setSpecialistOpen,
		setContactOpen,
		setNotificationsOpen
	} = useFlyoutPanelsState()
	return (
		<>
			<RequestFlyout isOpen={requestOpen} setIsOpen={setRequestOpen} engagement={engagement} />
			<NotificationFlyout isOpen={notificationsOpen} setIsOpen={setNotificationsOpen} />
			<SpecialistFlyout
				isOpen={specialistOpen}
				setIsOpen={setSpecialistOpen}
				specialist={specialist}
			/>
			<ContactFlyout isOpen={contactOpen} setIsOpen={setContactOpen} contact={contact} />
		</>
	)
})
