/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import ReportList from '~components/lists/ReportList'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'

const Reporting = memo(function Reporting(): JSX.Element {
	const { t } = useTranslation(['reporting'])
	const title = t('pageTitle')
	return (
		<>
			<Title title={title} />
			<ReportList title={title} />
		</>
	)
})

export default wrap(Reporting)
