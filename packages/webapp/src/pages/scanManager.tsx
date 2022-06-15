/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { ScanManagerBody } from '~components/ui/ScanManagerBody'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'

const ScanManagerPage = wrap(function ScanManagerPage() {
	const { t } = useTranslation(Namespace.Scan)
	const title = t('scanManager.pageTitle')
	return (
		<>
			<Title title={title} />
			<ScanManagerBody />
		</>
	)
})

export default ScanManagerPage
