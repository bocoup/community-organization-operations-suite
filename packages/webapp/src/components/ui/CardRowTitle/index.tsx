/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Link from 'next/link'
import { createElement } from 'react'
import type ComponentProps from '~types/ComponentProps'

interface CardRowTitleProps extends ComponentProps {
	title?: string
	titleLink?: string
	tag?: string
}

export default function CardRowTitle({
	title,
	titleLink,
	tag = 'h4'
}: CardRowTitleProps): JSX.Element {
	return (
		<>
			{title && titleLink && (
				<Link href={titleLink}>
					<a>{createElement(tag, { children: title })}</a>
				</Link>
			)}
			{title && !titleLink && createElement(tag, { children: title })}
		</>
	)
}
