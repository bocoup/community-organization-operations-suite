/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import TagsList from '~components/lists/TagsList'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'

const Tags = memo(function Tags(): JSX.Element {
	const { t } = useTranslation('tags')
	const title = t('pageTitle')
	return (
		<>
			<Title title={title} />
			<ContainerLayout>
				<TagsList title={t('requestTagsTitle')} />
			</ContainerLayout>
		</>
	)
})

export default wrap(Tags)
