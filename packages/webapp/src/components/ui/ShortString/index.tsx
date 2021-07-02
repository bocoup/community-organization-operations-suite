/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'
import type ComponentProps from '~types/ComponentProps'
import { useTranslation } from 'next-i18next'

interface ShortStringProps extends ComponentProps {
	text?: string
	limit?: number
	readMoreLabel?: string
	readLessLabel?: string
}

/**
 *
 * @returns {JSX.Element} component with read more / read less button
 */
const ShortString = memo(function ShortString({
	text = '',
	limit = 80,
	readMoreLabel = '...More',
	readLessLabel = '...Less'
}: ShortStringProps): JSX.Element {
	const { t } = useTranslation('common')
	const needsReadMore = text?.length > limit
	const subString = needsReadMore ? text.substr(0, limit - 1) : text
	const [isReadMoreOpen, setReadMoreOpen] = useState(false)

	readMoreLabel = t('shortString.more')
	readLessLabel = t('shortString.less')

	if (needsReadMore)
		return (
			<>
				{isReadMoreOpen ? text : subString}
				{/* TODO: This is currently not accessible via tab controls NOT-ACCESSIBLE  */}
				<a className='text-decoration-none ' onClick={() => setReadMoreOpen(!isReadMoreOpen)}>
					{isReadMoreOpen ? readLessLabel : readMoreLabel}
				</a>
			</>
		)
	else return <>{text}</>
})
export default ShortString
