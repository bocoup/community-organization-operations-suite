/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRef, useState } from 'react'
import { ServiceList } from '~components/lists/ServiceList'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useTranslation } from '~hooks/useTranslation'
import { Service, ServiceInput, ServiceStatus } from '@cbosuite/schema/dist/client-types'
import { ArchiveServiceModal } from '~components/ui/ArchiveServiceModal'
import { Title } from '~components/ui/Title'
import { wrap } from '~utils/appinsights'

const ServicesPage = wrap(function Services(): JSX.Element {
	const { orgId } = useCurrentUser()
	const { t } = useTranslation('services')
	const { serviceList, loading, updateService } = useServiceList(orgId)
	const [showModal, setShowModal] = useState(false)
	const serviceInput = useRef(null)
	const title = t('pageTitle')

	const handleServiceClose = (values: Service) => {
		const updatedService: ServiceInput = {
			serviceId: values.id,
			name: values.name,
			contactFormEnabled: values.contactFormEnabled,
			orgId: orgId,
			serviceStatus: ServiceStatus.Archive
		}
		serviceInput.current = updatedService
		setShowModal(true)
	}

	const archiveService = async () => {
		await updateService(serviceInput.current)
		serviceInput.current = null
		setShowModal(false)
	}

	const serviceName = serviceInput.current ? serviceInput.current.name : ''

	return (
		<>
			<Title title={title} />
			<ServiceList
				title={title}
				services={serviceList.filter((s) => s.serviceStatus !== ServiceStatus.Archive)}
				loading={loading}
				onServiceClose={handleServiceClose}
			/>
			<ArchiveServiceModal
				showModal={showModal}
				serviceName={serviceName}
				onSubmit={archiveService}
				onDismiss={() => setShowModal(false)}
			/>
		</>
	)
})

export default ServicesPage
