/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState } from 'react'
import type ComponentProps from '~types/ComponentProps'

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
export default function ShortString({
	text = '',
	limit = 80,
	// TODO: replace strings with translations
	readMoreLabel = '...More',
	readLessLabel = '...Less'
}: ShortStringProps): JSX.Element {
	const needsReadMore = text.length > limit
	const subString = needsReadMore ? text.substr(0, limit - 1) : text
	const [isReadMoreOpen, setReadMoreOpen] = useState(false)

	if (needsReadMore)
		return (
			<>
				{isReadMoreOpen ? text : subString}{' '}
				<a
					role='button'
					className='text-decoration-none'
					onClick={() => setReadMoreOpen(!isReadMoreOpen)}
				>
					{isReadMoreOpen ? readLessLabel : readMoreLabel}
				</a>
			</>
		)
	else return <>{text}</>
}
