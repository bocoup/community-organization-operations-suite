/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { useState, useEffect } from 'react'
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

const ServiceKiosk: FC<{ service: Service; sid: string }> = ({ service, sid }) => {
	const { t } = useTranslation(Namespace.Services)
	const [openNewFormPanel, setOpenNewFormPanel] = useState(false)
	const [newFormName, setNewFormName] = useState(null)
	const title = t('pageTitle')
	const { addServiceAnswer } = useServiceAnswerList(sid)
	const [showForm, setShowForm] = useState(true)
	const { addEngagement: addRequest } = useEngagementList()
	const { orgId } = useCurrentUser()

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

			<div className='mt-5 serviceKioskPage'>
				{showForm && (
					<FormGenerator
						service={service}
						onSubmit={handleAddServiceAnswer}
						previewMode={false}
						onAddNewClient={() => {
							setOpenNewFormPanel(true)
							setNewFormName('addClientForm')
						}}
						onQuickActions={() => {
							setOpenNewFormPanel(true)
							setNewFormName('quickActionsPanel')
						}}
					/>
				)}
			</div>
		</>
	)
}
const ServiceKioskPage: FC = wrap(function EditService() {
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

	return selectedService ? <ServiceKiosk service={selectedService} sid={sid} /> : null
})

export default ServiceKioskPage
