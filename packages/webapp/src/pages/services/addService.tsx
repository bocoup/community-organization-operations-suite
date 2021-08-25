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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'footer']))
		}
	}
}

const AddService = memo(function AddService(): JSX.Element {
	return (
		<ContainerLayout documentTitle={'Services'}>
			<ClientOnly>
				<AddServiceForm onSubmit={values => console.log('formsubmit', values)} />
			</ClientOnly>
		</ContainerLayout>
	)
})
export default AddService
