/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRecoilState } from 'recoil'
import { isNotificationsPanelOpenState } from '~store'
import { RequestPanel } from '~ui/RequestPanel'
import { FC, memo, useEffect, useState } from 'react'
import { NotificationPanel } from '~components/ui/NotificationsPanel'
import { useOrganization } from '~hooks/api/useOrganization'
import { SpecialistPanel } from '~ui/SpecialistPanel'
import { ContactPanel } from '~ui/ContactPanel'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useHistory } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'
import { navigate } from '~utils/navigate'

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

	useEffect(() => {
		// If a request is added to the router query after page load open the request panel
		// And close the notification panel
		if (isValidId(engagement) && !requestOpen) {
			setRequestOpen(true)
			setSpecialistOpen(false)
			setNotificationsOpen(false)
			setContactOpen(false)
		}

		if (isValidId(specialist) && !specialistOpen) {
			setSpecialistOpen(true)
			setRequestOpen(false)
			setNotificationsOpen(false)
			setContactOpen(false)
		}

		if (isValidId(contact) && !contactOpen) {
			setContactOpen(true)
			setSpecialistOpen(false)
			setRequestOpen(false)
			setNotificationsOpen(false)
		}
	}, [setRequestOpen, engagement, setNotificationsOpen, setSpecialistOpen, specialist, contact, setContactOpen, requestOpen, specialistOpen, contactOpen])

	return (
		<>
			{/* Request panel here */}
			<RequestPanel
				openPanel={requestOpen}
				onDismiss={() => {
					navigate(history, history.location.pathname, { engagement: undefined })
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
					navigate(history, history.location.pathname, { specialist: undefined })
					setSpecialistOpen(false)
				}}
				specialistId={specialist ? (specialist as string) : undefined}
			/>

			<ContactPanel
				openPanel={contactOpen}
				onDismiss={() => {
					navigate(history, history.location.pathname, { contact: undefined })
					setContactOpen(false)
				}}
				contactId={contact ? (contact as string) : undefined}
			/>
		</>
	)
})

function isValidId(input: string | undefined): boolean {
	return typeof input === 'string' && input.trim().length > 0
}
