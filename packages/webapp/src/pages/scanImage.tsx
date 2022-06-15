/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { ScanImageBody } from '~components/ui/ScanImageBody'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'

const ScanImagePage = wrap(function ScanImagePage() {
	const { t } = useTranslation(Namespace.Scan)
	const title = t('scanImage.pageTitle')
	return (
		<>
			<Title title={title} />
			<ScanImageBody />
		</>
	)
})

export default ScanImagePage
