/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo } from 'react'
import ClientOnly from '~ui/ClientOnly'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useRouter } from 'next/router'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import FormGenerator from '~components/ui/FormGenerator'

const EditService = memo(function EditService(): JSX.Element {
	const { orgId } = useCurrentUser()
	const { t } = useTranslation('services')
	const router = useRouter()
	const { serviceList, addServiceAnswer } = useServiceList(orgId)

	const { sid } = router.query
	const selectedService =
		typeof sid === 'string' ? serviceList.find((s) => s.id === sid) : undefined

	const handleAddServiceAnswer = async (values) => {
		await addServiceAnswer(values)
	}

	return (
		<ContainerLayout documentTitle={t('pageTitle')}>
			<ClientOnly>
				<div className='mt-5'>
					<FormGenerator
						service={selectedService}
						onSubmit={handleAddServiceAnswer}
						previewMode={false}
					/>
				</div>
			</ClientOnly>
		</ContainerLayout>
	)
})
export default wrap(EditService)
