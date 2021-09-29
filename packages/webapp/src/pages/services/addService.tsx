/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo } from 'react'
import ClientOnly from '~ui/ClientOnly'
import AddServiceForm from '~components/forms/AddServiceForm'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { ServiceInput } from '@cbosuite/schema/dist/client-types'
import { useRouter } from 'next/router'
import { useTranslation } from '~hooks/useTranslation'
import { Title } from '~components/ui/Title'

const AddService = memo(function AddService(): JSX.Element {
	const { orgId } = useCurrentUser()
	const { t } = useTranslation('services')
	const router = useRouter()
	const { addNewService } = useServiceList(orgId)

	// TODO: ask clarification about this
	// suggest that when a new service is created, it should be set as INACTIVE
	// INACTIVE service should allow Edits.
	// but when a service is Started, it should be set as ACTIVE and the user should not be able to edit it.
	// this is to make sure that date structure is consistent once it is started.
	const handleAddService = async (values) => {
		const newService: ServiceInput = {
			...values,
			orgId,
			serviceStatus: 'INACTIVE'
		}
		const res = await addNewService(newService)
		if (res) {
			router.push(`/services`, undefined, { shallow: true })
		}
	}
	const title = t('pageTitle')

	return (
		<ContainerLayout>
			<Title title={title} />
			<ClientOnly>
				<AddServiceForm onSubmit={(values) => handleAddService(values)} />
			</ClientOnly>
		</ContainerLayout>
	)
})
export default AddService
