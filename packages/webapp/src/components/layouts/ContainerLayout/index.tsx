/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import DefaultLayout, { DefaultLayoutProps } from '~layouts/Default'
import ActionBar from '~ui/ActionBar'
import CRC from '~ui/CRC'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { isNotificationsPanelOpenState } from '~store'
import RequestPanel from '~ui/RequestPanel'
import { memo, useEffect, useState } from 'react'
import { useAuthUser } from '~hooks/api/useAuth'
import NotificationPanel from '~components/ui/NotificationsPanel'
import SubscribeToMentions from '~ui/SubscribeToMentions'
import ClientOnly from '~ui/ClientOnly'
import styles from './index.module.scss'
import { useOrganization } from '~hooks/api/useOrganization'
import SpecialistPanel from '~ui/SpecialistPanel'
import ContactPanel from '~ui/ContactPanel'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useTranslation } from '~hooks/useTranslation'
import AddClientForm from '~components/forms/AddClientForm'
import Panel from '~components/ui/Panel'
import { useBoolean } from '@fluentui/react-hooks'
import AddRequestForm from '~forms/AddRequestForm'
import { wrap } from '~utils/appinsights'
import QuickActionsPanelBody from '~components/ui/QuickActionsPanelBody'

export interface ContainerLayoutProps extends DefaultLayoutProps {
	title?: string
	size?: 'sm' | 'md' | 'lg'
	showTitle?: boolean
	documentTitle?: string
	showNewFormPanel?: boolean
	newFormPanelName?: string
	onNewFormPanelSubmit?: (values: any) => void
	onNewFormPanelDismiss?: () => void
}

const ContainerLayout = memo(function ContainerLayout({
	children,
	title,
	size,
	showTitle = true,
	showNav = true,
	documentTitle,
	showNewFormPanel = false,
	newFormPanelName,
	onNewFormPanelSubmit,
	onNewFormPanelDismiss
}: ContainerLayoutProps): JSX.Element {
	const router = useRouter()
	const { accessToken } = useAuthUser()
	const { orgId } = useCurrentUser()
	const { engagement, specialist, contact } = router.query
	const [requestOpen, setRequestOpen] = useState(!!engagement)
	const [specialistOpen, setSpecialistOpen] = useState(!!specialist)
	const [contactOpen, setContactOpen] = useState(!!contact)
	const [notificationsOpen, setNotificationsOpen] = useRecoilState(isNotificationsPanelOpenState)
	const { organization } = useOrganization(orgId)
	const [isNewFormPanelOpen, { setTrue: openNewFormPanel, setFalse: dismissNewFormPanel }] =
		useBoolean(false)

	const { t: clientT } = useTranslation('clients')

	useEffect(() => {
		if (Object.keys(router.query).length === 0) {
			setRequestOpen(false)
			setNotificationsOpen(false)
			setSpecialistOpen(false)
			setContactOpen(false)
		}
	}, [router.query, setNotificationsOpen, setRequestOpen, setSpecialistOpen, setContactOpen])

	useEffect(() => {
		// If a request is added to the router query after page load open the request panel
		// And close the notification panel
		if (typeof engagement === 'string') {
			setRequestOpen(true)
			setSpecialistOpen(false)
			setNotificationsOpen(false)
			setContactOpen(false)
		}

		if (typeof specialist === 'string') {
			setSpecialistOpen(true)
			setRequestOpen(false)
			setNotificationsOpen(false)
			setContactOpen(false)
		}

		if (typeof contact === 'string') {
			setContactOpen(true)
			setSpecialistOpen(false)
			setRequestOpen(false)
			setNotificationsOpen(false)
		}
	}, [
		setRequestOpen,
		engagement,
		setNotificationsOpen,
		setSpecialistOpen,
		specialist,
		contact,
		setContactOpen
	])

	useEffect(() => {
		if (showNewFormPanel) {
			openNewFormPanel()
		}
	}, [showNewFormPanel, openNewFormPanel])

	const handleNewFormPanelDismiss = () => {
		dismissNewFormPanel()
		onNewFormPanelDismiss?.()
	}

	const handleNewFormPanelSubmit = (values: any) => {
		onNewFormPanelSubmit?.(values)
		handleNewFormPanelDismiss()
	}

	const renderNewFormPanel = (formName: string) => {
		switch (formName) {
			case 'addClientForm':
				return (
					<AddClientForm title={clientT('clientAddButton')} closeForm={handleNewFormPanelDismiss} />
				)
			case 'addRequestForm':
				return <AddRequestForm onSubmit={handleNewFormPanelSubmit} />
			case 'quickActionsPanel':
				return <QuickActionsPanelBody />
			default:
				return null
		}
	}

	return (
		<>
			<DefaultLayout showNav={showNav} title={documentTitle}>
				<ClientOnly className={styles.actionBar}>
					<ActionBar
						showNav={showNav}
						showTitle={showTitle}
						title={organization?.name}
						showPersona
						showNotifications
					/>
				</ClientOnly>

				{/* Request panel here */}
				<RequestPanel
					openPanel={requestOpen}
					onDismiss={() => {
						router.push(router.pathname, undefined, { shallow: true })
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
						router.push(router.pathname, undefined, { shallow: true })
						setSpecialistOpen(false)
					}}
					specialistId={specialist ? (specialist as string) : undefined}
				/>

				<ContactPanel
					openPanel={contactOpen}
					onDismiss={() => {
						router.push(router.pathname, undefined, { shallow: true })
						setContactOpen(false)
					}}
					contactId={contact ? (contact as string) : undefined}
				/>

				<Panel openPanel={isNewFormPanelOpen} onDismiss={handleNewFormPanelDismiss}>
					{renderNewFormPanel(newFormPanelName)}
				</Panel>

				<CRC size={size} className={styles.content}>
					<>
						{accessToken && (
							<ClientOnly>
								<SubscribeToMentions />
							</ClientOnly>
						)}

						{title && <h1 className='mt-5'>{title}</h1>}

						{accessToken && children}
					</>
				</CRC>
			</DefaultLayout>
		</>
	)
})
export default wrap(ContainerLayout)
