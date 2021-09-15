/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo } from 'react'
import ServiceList from '~components/lists/ServiceList'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useTranslation } from '~hooks/useTranslation'
import { Service, ServiceInput, ServiceStatus } from '@cbosuite/schema/dist/client-types'

const Services = memo(function Services(): JSX.Element {
	const { orgId } = useCurrentUser()
	const { t } = useTranslation('services')
	const { serviceList, loading, updateService } = useServiceList(orgId)

	const handleServiceClose = async (values: Service) => {
		const updatedService: ServiceInput = {
			serviceId: values.id,
			name: values.name,
			contactFormEnabled: values.contactFormEnabled,
			orgId: orgId,
			serviceStatus: ServiceStatus.Closed
		}
		await updateService(updatedService)
	}

	return (
		<ContainerLayout documentTitle={t('pageTitle')}>
			<ServiceList
				title={t('pageTitle')}
				services={serviceList.filter((s) => s.serviceStatus !== ServiceStatus.Closed)}
				loading={loading}
				onServiceClose={handleServiceClose}
			/>
		</ContainerLayout>
	)
})
export default Services
