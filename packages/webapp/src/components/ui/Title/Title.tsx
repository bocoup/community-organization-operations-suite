/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Head from 'react-helmet'
import { FC, memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

export const Title: FC<{ title?: string }> = memo(function Title({ title }) {
	const { c } = useTranslation()
	return (
		<Head>
			<title>
				{c('app.head.title')} - {title || c('app.head.subTitle')}
			</title>
		</Head>
	)
})
