/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import SpecialistList from '~lists/SpecialistList'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'

const Home = memo(function Home(): JSX.Element {
	const { t } = useTranslation('specialists')
	const title = t('pageTitle')
	return (
		<ContainerLayout>
			<Title title={title} />
			<SpecialistList title={t('specialistsTitle')} />
		</ContainerLayout>
	)
})
export default wrap(Home)
