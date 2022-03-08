/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TagsList } from '~components/lists/TagsList'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import type { FC } from 'react'

const TagsPage: FC = wrap(function Tags() {
	const { t } = useTranslation(Namespace.Tags)
	const title = t('pageTitle')
	return (
		<>
			<Title title={title} />
			<TagsList title={t('requestTagsTitle')} />
		</>
	)
})

export default TagsPage
