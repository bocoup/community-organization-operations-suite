/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import ReportList from '~components/lists/ReportList'
import { wrap } from '~utils/appinsights'

const Reporting = memo(function Reporting(): JSX.Element {
	const { t } = useTranslation(['reporting'])

	return (
		<ContainerLayout documentTitle={t('pageTitle')}>
			<ReportList title={t('pageTitle')} />
		</ContainerLayout>
	)
})

export default wrap(Reporting)
