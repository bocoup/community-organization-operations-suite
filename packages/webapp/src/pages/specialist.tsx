/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import SpecialistList from '~lists/SpecialistList'
import { memo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import { useTranslation } from '~hooks/useTranslation'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'footer', 'specialists']))
		}
	}
}

const Home = memo(function Home(): JSX.Element {
	const { t } = useTranslation('specialists')

	return (
		<ContainerLayout documentTitle={t('page.title')}>
			<SpecialistList title={t('specialists.title')} />
		</ContainerLayout>
	)
})
export default Home
