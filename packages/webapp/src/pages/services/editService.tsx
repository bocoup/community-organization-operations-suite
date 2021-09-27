/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo } from 'react'
import ClientOnly from '~ui/ClientOnly'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { ServiceInput, ServiceStatus } from '@cbosuite/schema/lib/client-types'
import { useTranslation } from '~hooks/useTranslation'
import EditServiceForm from '~components/forms/EditServiceForm'
import { useHistory } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'
import { Title } from '~components/ui/Title'

const EditService = memo(function EditService(): JSX.Element {
	const history = useHistory()
	const { orgId } = useCurrentUser()
	const { t } = useTranslation('services')
	const title = t('pageTitle')
	const { serviceList, updateService } = useServiceList(orgId)

	const { sid } = useLocationQuery()
	const selectedService =
		typeof sid === 'string' ? serviceList.find((s) => s.id === sid) : undefined

	if (selectedService?.serviceStatus === ServiceStatus.Archive) {
		history.push(`/services`)
	}

	const handleUpdateService = async (values) => {
		const updatedService: ServiceInput = {
			...values,
			serviceId: sid,
			orgId,
			serviceStatus: selectedService?.serviceStatus
		}
		const res = await updateService(updatedService)
		if (res) {
			history.push(`/services`)
		}
	}

	return (
		<>
			<Title title={title} />
			<ContainerLayout>
				<ClientOnly>
					<EditServiceForm
						service={selectedService}
						onSubmit={(values) => handleUpdateService(values)}
					/>
				</ClientOnly>
			</ContainerLayout>
		</>
	)
})
export default EditService
