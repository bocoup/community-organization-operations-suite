/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import ClientOnly from '~ui/ClientOnly'
import AddServiceForm from '~components/forms/AddServiceForm'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { ServiceInput } from '@cbosuite/schema/lib/client-types'
import { useRouter } from 'next/router'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'footer']))
		}
	}
}

const AddService = memo(function AddService(): JSX.Element {
	const { orgId } = useCurrentUser()
	const router = useRouter()
	const { addNewService } = useServiceList(orgId)

	const handleAddService = async (values) => {
		const newService: ServiceInput = {
			...values,
			orgId,
			serviceStatus: 'ACTIVE'
		}
		const res = await addNewService(newService)
		if (res) {
			router.push(`/services`, undefined, { shallow: true })
		}
	}

	return (
		<ContainerLayout documentTitle={'Services'}>
			<ClientOnly>
				<AddServiceForm onSubmit={(values) => handleAddService(values)} />
			</ClientOnly>
		</ContainerLayout>
	)
})
export default AddService
