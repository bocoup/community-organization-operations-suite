/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo } from 'react'
import ClientOnly from '~ui/ClientOnly'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { ServiceInput } from '@cbosuite/schema/dist/client-types'
import { useRouter } from 'next/router'
import { useTranslation } from '~hooks/useTranslation'
import EditServiceForm from '~components/forms/EditServiceForm'

const EditService = memo(function EditService(): JSX.Element {
	const { orgId } = useCurrentUser()
	const { t } = useTranslation('services')
	const router = useRouter()
	const { serviceList, updateService, addServiceAnswer } = useServiceList(orgId)

	const { sid } = router.query
	const selectedService =
		typeof sid === 'string' ? serviceList.find((s) => s.id === sid) : undefined

	const handleUpdateService = async (values) => {
		const updatedService: ServiceInput = {
			...values,
			serviceId: sid,
			orgId,
			serviceStatus: 'ACTIVE'
		}
		const res = await updateService(updatedService)
		if (res) {
			router.push(`/services`, undefined, { shallow: true })
		}
	}

	const handleAddServiceAnswer = async (values) => {
		console.log(values)
		await addServiceAnswer(values)
	}

	return (
		<ContainerLayout documentTitle={t('pageTitle')}>
			<ClientOnly>
				<EditServiceForm
					service={selectedService}
					onSubmit={(values) => handleUpdateService(values)}
					onSubmitAnswers={(answers) => handleAddServiceAnswer(answers)}
				/>
			</ClientOnly>
		</ContainerLayout>
	)
})
export default EditService
