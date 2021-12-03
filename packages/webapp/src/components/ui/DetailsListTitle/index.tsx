/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Icon } from '@fluentui/react'
import { memo } from 'react'
// TODO: add right chevron element

interface DetailsListTitleProps {
	title?: string
}

export const DetailsListTitle: StandardFC<DetailsListTitleProps> = memo(function DetailsListTitle({
	children
}) {
	return (
		<h2 className={cx('d-flex align-items-center', styles.detailsListTitle)}>
			{/* TODO: add right chevron element */}
			<Icon className={cx('me-2', styles.icon)} iconName='ChevronRight' />
			{/* TODO: consider adding transform on hover */}
			{children}
		</h2>
	)
})
