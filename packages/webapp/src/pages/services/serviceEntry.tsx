/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { Service } from '@cbosuite/schema/dist/client-types'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { wrap, trackEvent } from '~utils/appinsights'
import { FormGenerator } from '~components/ui/FormGenerator'
import { useLocationQuery } from '~hooks/useLocationQuery'
import { Title } from '~components/ui/Title'
import { NewFormPanel } from '~components/ui/NewFormPanel'
import { useServiceAnswerList } from '~hooks/api/useServiceAnswerList'
import { useEngagementList } from '~hooks/api/useEngagementList'
import { useNavCallback } from '~hooks/useNavCallback'
import { useAuthUser } from '~hooks/api/useAuth'
import { ApplicationRoute } from '~types/ApplicationRoute'
import styles from './index.module.scss'

const ServiceEntry: FC<{ service: Service; sid: string }> = ({ service, sid }) => {
	const { t } = useTranslation(Namespace.Services)
	const [openNewFormPanel, setOpenNewFormPanel] = useState(false)
	const [newFormName, setNewFormName] = useState(null)
	const title = t('pageTitle')
	const { addServiceAnswer } = useServiceAnswerList(sid)
	const [showForm, setShowForm] = useState(true)
	const { addEngagement: addRequest } = useEngagementList()
	const { orgId } = useCurrentUser()
	const location = useLocation()
	const kioskMode = location.pathname === ApplicationRoute.ServiceKioskMode

	const { logout } = useAuthUser()
	const onLogout = useNavCallback(ApplicationRoute.Logout)

	const handleAddServiceAnswer = async (values) => {
		const res = await addServiceAnswer(values)
		if (res) {
			trackEvent({
				name: 'Service Submitted',
				properties: {
					'Organization ID': orgId
				}
			})
			// Note: need a better way to do this
			setShowForm(false)
			setShowForm(true)
		}
	}

	const handleNewFormPanelSubmit = function newFormPanelSubmitCallback(
		values: any,
		formName?: string
	) {
		switch (formName ?? newFormName) {
			case 'addRequestForm':
				addRequest(values)
				break
		}
	}

	return (
		<>
			<Title title={title} />
			<NewFormPanel
				onNewFormPanelSubmit={handleNewFormPanelSubmit}
				showNewFormPanel={openNewFormPanel}
				newFormPanelName={newFormName}
				onNewFormPanelDismiss={() => setOpenNewFormPanel(false)}
			/>

			<div className={'serviceEntryPage' + (kioskMode ? ' mt-5' : '')}>
				{showForm && (
					<FormGenerator
						service={service}
						onSubmit={handleAddServiceAnswer}
						previewMode={false}
						onAddNewClient={() => {
							setOpenNewFormPanel(true)
							setNewFormName('addClientForm')
						}}
						onQuickActions={
							!kioskMode &&
							(() => {
								setOpenNewFormPanel(true)
								setNewFormName('quickActionsPanel')
							})
						}
					/>
				)}

				{kioskMode && (
					<button
						className={styles.cornerExit}
						onClick={() => {
							logout()
							onLogout()
						}}
					>
						Exit
					</button>
				)}
			</div>
		</>
	)
}
const ServiceEntryPage: FC = wrap(function EditService() {
	const { orgId } = useCurrentUser()
	const { serviceList } = useServiceList(orgId)
	const { sid } = useLocationQuery()
	const [selectedService, setSelectedService] = useState(null)

	useEffect(() => {
		if (serviceList && sid) {
			const service = serviceList.find((s) => s.id === sid)
			if (service) {
				setSelectedService(service)
			}
		}
	}, [sid, serviceList])

	return selectedService ? <ServiceEntry service={selectedService} sid={sid} /> : null
})

export default ServiceEntryPage
