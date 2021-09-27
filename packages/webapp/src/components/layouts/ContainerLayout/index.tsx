/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import DefaultLayout, { DefaultLayoutProps } from '~layouts/Default'
import ActionBar from '~ui/ActionBar'
import CRC from '~ui/CRC'
import { useRecoilState } from 'recoil'
import { isNotificationsPanelOpenState } from '~store'
import RequestPanel from '~ui/RequestPanel'
import { memo, useEffect, useState, useCallback } from 'react'
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
import ServiceListPanelBody from '~components/ui/ServiceListPanelBody'
import { useHistory } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'

export interface ContainerLayoutProps extends DefaultLayoutProps {
	size?: 'sm' | 'md' | 'lg'
	showTitle?: boolean
	showNewFormPanel?: boolean
	newFormPanelName?: string
	onNewFormPanelSubmit?: (values: any) => void
	onNewFormPanelDismiss?: () => void
}

const ContainerLayout = memo(function ContainerLayout({
	children,
	size,
	showTitle = true,
	showNav = true,
	showNewFormPanel = false,
	newFormPanelName,
	onNewFormPanelSubmit,
	onNewFormPanelDismiss
}: ContainerLayoutProps): JSX.Element {
	const history = useHistory()
	const { accessToken } = useAuthUser()
	const { orgId } = useCurrentUser()
	const { engagement, specialist, contact } = useLocationQuery()
	const [requestOpen, setRequestOpen] = useState(!!engagement)
	const [specialistOpen, setSpecialistOpen] = useState(!!specialist)
	const [contactOpen, setContactOpen] = useState(!!contact)
	const [notificationsOpen, setNotificationsOpen] = useRecoilState(isNotificationsPanelOpenState)
	const { organization } = useOrganization(orgId)
	const [isNewFormPanelOpen, { setTrue: openNewFormPanel, setFalse: dismissNewFormPanel }] =
		useBoolean(false)

	const { t: clientT } = useTranslation('clients')
	const [newFormPanelNameState, setNewFormPanelName] = useState(newFormPanelName)

	useEffect(() => {
		if (history.location.search.length === 0) {
			setRequestOpen(false)
			setNotificationsOpen(false)
			setSpecialistOpen(false)
			setContactOpen(false)
		}
	}, [
		history.location.search,
		setNotificationsOpen,
		setRequestOpen,
		setSpecialistOpen,
		setContactOpen
	])

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

	const handleNewFormPanelDismiss = useCallback(() => {
		dismissNewFormPanel()
		onNewFormPanelDismiss?.()
	}, [dismissNewFormPanel, onNewFormPanelDismiss])

	const handleNewFormPanelSubmit = useCallback(
		(values: any) => {
			onNewFormPanelSubmit?.(values)
			handleNewFormPanelDismiss()
		},
		[onNewFormPanelSubmit, handleNewFormPanelDismiss]
	)

	const handleQuickActionsButton = useCallback(
		(buttonName: string) => {
			setNewFormPanelName(buttonName)
		},
		[setNewFormPanelName]
	)

	const renderNewFormPanel = useCallback(
		(formName: string): JSX.Element => {
			switch (formName) {
				case 'addClientForm':
					return (
						<AddClientForm
							title={clientT('clientAddButton')}
							closeForm={handleNewFormPanelDismiss}
						/>
					)
				case 'addRequestForm':
					return <AddRequestForm onSubmit={handleNewFormPanelSubmit} />
				case 'quickActionsPanel':
					return <QuickActionsPanelBody onButtonClick={handleQuickActionsButton} />
				case 'startServiceForm':
					return <ServiceListPanelBody />
				default:
					return null
			}
		},
		[clientT, handleNewFormPanelDismiss, handleNewFormPanelSubmit, handleQuickActionsButton]
	)

	useEffect(() => {
		setNewFormPanelName(newFormPanelName)
		if (showNewFormPanel) {
			openNewFormPanel()
		} else {
			dismissNewFormPanel()
		}
	}, [showNewFormPanel, newFormPanelName, openNewFormPanel, dismissNewFormPanel])

	return (
		<>
			<DefaultLayout showNav={showNav}>
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

				<Panel openPanel={isNewFormPanelOpen} onDismiss={handleNewFormPanelDismiss}>
					{newFormPanelNameState && renderNewFormPanel(newFormPanelNameState)}
				</Panel>

				<CRC size={size} className={styles.content}>
					<>
						{accessToken && (
							<ClientOnly>
								<SubscribeToMentions />
							</ClientOnly>
						)}
						{accessToken && children}
					</>
				</CRC>
			</DefaultLayout>
		</>
	)
})
export default wrap(ContainerLayout)
