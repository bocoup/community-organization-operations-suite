/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import RequestTagsList from '~components/lists/RequestTagsList'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

const RequestTags = memo(function RequestTags(): JSX.Element {
	const { t } = useTranslation('requestTags')

	return (
		<ContainerLayout documentTitle={t('page.title')}>
			<RequestTagsList title={t('requestTags.title')} />
		</ContainerLayout>
	)
})

export default RequestTags
