/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
			<TagsList title={t('requestTagsTitle')} />
		</>
	)
})

export default wrap(Tags)
