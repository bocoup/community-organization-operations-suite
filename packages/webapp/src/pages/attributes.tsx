/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import AttributesList from '~components/lists/AttributesList'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import getServerSideTranslations from '~utils/getServerSideTranslations'

export const getStaticProps = getServerSideTranslations(['attributes'])

const Attributes = memo(function Attributes(): JSX.Element {
	const { t } = useTranslation('attributes')

	return (
		<ContainerLayout documentTitle={t('page.title')}>
			<AttributesList title={t('attributes.title')} />
		</ContainerLayout>
	)
})

export default Attributes
