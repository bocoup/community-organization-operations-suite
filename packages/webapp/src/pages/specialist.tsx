/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import SpecialistList from '~lists/SpecialistList'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'

const Home = wrap(
	memo(function Home(): JSX.Element {
		const { t } = useTranslation('specialists')
		const title = t('pageTitle')

		return (
			<>
				<Title title={title} />
				<SpecialistList title={t('specialistsTitle')} />
			</>
		)
	})
)
export default Home
