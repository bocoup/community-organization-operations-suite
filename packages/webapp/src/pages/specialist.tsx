/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import SpecialistList from '~lists/SpecialistList'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'

const Home = memo(function Home(): JSX.Element {
	const { t } = useTranslation('specialists')

	return (
		<ContainerLayout documentTitle={t('pageTitle')}>
			<SpecialistList title={t('specialistsTitle')} />
		</ContainerLayout>
	)
})
export default wrap(Home)
