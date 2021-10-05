/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRecoilState } from 'recoil'
import { isNotificationsPanelOpenState } from '~store'
import { RequestPanel } from '~ui/RequestPanel'
import { FC, memo, useEffect, useLayoutEffect, useState } from 'react'
import { NotificationPanel } from '~components/ui/NotificationsPanel'
import { useOrganization } from '~hooks/api/useOrganization'
import { SpecialistPanel } from '~ui/SpecialistPanel'
import { ContactPanel } from '~ui/ContactPanel'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useHistory } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'

export const FlyoutPanels: FC = memo(function FlyoutPanels() {
	const history = useHistory()
	const { orgId } = useCurrentUser()
	const { engagement, specialist, contact } = useLocationQuery()
	const [requestOpen, setRequestOpen] = useState(!!engagement)
	const [specialistOpen, setSpecialistOpen] = useState(!!specialist)
	const [contactOpen, setContactOpen] = useState(!!contact)
	const [notificationsOpen, setNotificationsOpen] = useRecoilState(isNotificationsPanelOpenState)
	const { organization } = useOrganization(orgId)

	useEffect(() => {
		if (history.location.search.length === 0) {
			setRequestOpen(false)
			setNotificationsOpen(false)
			setSpecialistOpen(false)
			setContactOpen(false)
		}
	}, [history.location.search, setNotificationsOpen, setRequestOpen, setSpecialistOpen, setContactOpen])

	useLayoutEffect(() => {
		// If a request is added to the router query after page load open the request panel
		// And close the notification panel
		if (typeof engagement === 'string' && engagement.length > 0) {
			setRequestOpen(true)
			setSpecialistOpen(false)
			setNotificationsOpen(false)
			setContactOpen(false)
		}

		if (typeof specialist === 'string' && specialist.length > 0) {
			setSpecialistOpen(true)
			setRequestOpen(false)
			setNotificationsOpen(false)
			setContactOpen(false)
		}

		if (typeof contact === 'string' && contact.length > 0) {
			setContactOpen(true)
			setSpecialistOpen(false)
			setRequestOpen(false)
			setNotificationsOpen(false)
		}
	}, [setRequestOpen, engagement, setNotificationsOpen, setSpecialistOpen, specialist, contact, setContactOpen])

	return (
		<>
			<div data-testid='flyout-panels' />
			{/* Request panel here */}
			<RequestPanel
				openPanel={requestOpen}
				onDismiss={() => {
					setRequestOpen(false)
				}}
				request={engagement ? { id: engagement as string, orgId: organization?.id } : undefined}
			/>

			<NotificationPanel
				openPanel={notificationsOpen}
				onDismiss={() => setNotificationsOpen(false)}
			/>

			<SpecialistPanel
				openPanel={specialistOpen}
				onDismiss={() => {
					setSpecialistOpen(false)
				}}
				specialistId={specialist ? (specialist as string) : undefined}
			/>

			<ContactPanel
				openPanel={contactOpen}
				onDismiss={() => {
					setContactOpen(false)
				}}
				contactId={contact ? (contact as string) : undefined}
			/>
		</>
	)
})
