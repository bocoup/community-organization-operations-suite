/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import { useTranslation } from '~hooks/useTranslation'
import ServiceList from '~components/lists/ServiceList'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'footer']))
		}
	}
}

const Services = memo(function Services(): JSX.Element {
	const { t } = useTranslation('specialists')

	return (
		<ContainerLayout documentTitle={'Services'}>
			<ServiceList title={'Services'} services={[]} />
		</ContainerLayout>
	)
})
export default Services
