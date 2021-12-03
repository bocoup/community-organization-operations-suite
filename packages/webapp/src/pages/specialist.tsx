/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SpecialistList } from '~lists/SpecialistList'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import { FC } from 'react'

const HomePage: FC = wrap(function Home() {
	const { t } = useTranslation(Namespace.Specialists)
	const title = t('pageTitle')

	return (
		<>
			<Title title={title} />
			<SpecialistList title={t('specialistsTitle')} />
		</>
	)
})

export default HomePage
