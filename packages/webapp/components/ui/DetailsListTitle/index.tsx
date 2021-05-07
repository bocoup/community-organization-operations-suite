/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
// TODO: add right chevron element
// import { FontIcon } from '@fluentui/react'

interface DetailsListTitleProps extends ComponentProps {
	title?: string
}

export default function DetailsListTitle({ children }: DetailsListTitleProps): JSX.Element {
	return (
		<h2 className='d-flex align-items-center'>
			{/* TODO: add right chevron element */}
			{/* <FontIcon className='me-2' iconName='ChevronRightSmall' /> */}
			{/* TODO: consider adding transform on hover */}
			{children}
		</h2>
	)
}
