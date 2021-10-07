/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect, useState } from 'react'
import { useLocationQuery } from '~hooks/useLocationQuery'
import { useNavCallback } from '~hooks/useNavCallback'

export function useFlyoutDismisser(queryArg: string, setIsOpen: (isOpen: boolean) => void) {
	const navClearContact = useNavCallback(null, { [queryArg]: undefined })
	return useCallback(() => {
		navClearContact()
		setIsOpen(false)
	}, [setIsOpen, navClearContact])
}

export function useFlyoutPanelsState() {
	// pull in query arguments from the URL
	const { engagement, specialist, contact, notifications } = useLocationQuery()

	// initialize isOpen state with the query arguments existence
	const [requestOpen, setRequestOpen] = useState(!!engagement)
	const [specialistOpen, setSpecialistOpen] = useState(!!specialist)
	const [contactOpen, setContactOpen] = useState(!!contact)
	const [notificationsOpen, setNotificationsOpen] = useState(!!notifications)

	useEffect(() => {
		//
		// Phase 1: If query args are not present but panels are open, close them
		//
		if (!isValidId(engagement) && requestOpen) {
			setRequestOpen(false)
		}
		if (!isValidId(specialist) && specialistOpen) {
			setSpecialistOpen(false)
		}
		if (!isValidId(contact) && contactOpen) {
			setContactOpen(false)
		}
		if (!isValidId(notifications) && notificationsOpen) {
			setNotificationsOpen(false)
		}

		//
		// Phase 2: If query args are present and panels are not open, open them
		//
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
		if (isValidId(notifications) && !notificationsOpen) {
			setNotificationsOpen(true)
			setSpecialistOpen(false)
			setRequestOpen(false)
			setRequestOpen(false)
		}
	}, [
		setRequestOpen,
		engagement,
		setNotificationsOpen,
		setSpecialistOpen,
		specialist,
		contact,
		setContactOpen,
		requestOpen,
		specialistOpen,
		contactOpen,
		notifications,
		notificationsOpen
	])

	return {
		contact,
		engagement,
		specialist,
		contactOpen,
		requestOpen,
		specialistOpen,
		notificationsOpen,
		setRequestOpen,
		setSpecialistOpen,
		setContactOpen,
		setNotificationsOpen
	}
}
function isValidId(input: string | undefined): boolean {
	return typeof input === 'string' && input.trim().length > 0
}
