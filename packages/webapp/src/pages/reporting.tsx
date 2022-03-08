/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { ReportList } from '~components/lists/ReportList'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import type { FC } from 'react'

const ReportingPage: FC = wrap(function Reporting() {
	const { t } = useTranslation(Namespace.Reporting)
	const title = t('pageTitle')
	return (
		<>
			<Title title={title} />
			<ReportList title={title} />
		</>
	)
})

export default ReportingPage
