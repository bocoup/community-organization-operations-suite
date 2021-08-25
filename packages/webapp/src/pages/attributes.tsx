/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import AttributesList from '~components/lists/AttributesList'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

const Attributes = memo(function Attributes(): JSX.Element {
	const { t } = useTranslation('attributes')

	return (
		<ContainerLayout documentTitle={t('pageTitle')}>
			<AttributesList title={t('attributesTitle')} />
		</ContainerLayout>
	)
})

export default Attributes
