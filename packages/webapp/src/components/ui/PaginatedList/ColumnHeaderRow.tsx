/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import type { StandardFC } from '~types/StandardFC'
import styles from './index.module.scss'
import { nullFn } from '~utils/noop'
import { IPaginatedListColumn, OnHeaderClick } from './types'

export const ColumnHeaderRow: StandardFC<{
	columns: IPaginatedListColumn[]
	onHeaderClick?: OnHeaderClick
}> = memo(function ColumnHeaderRow({ className, columns, onHeaderClick = nullFn }) {
	return (
		<Row className={cx(styles.columnHeaderRow, className)}>
			{columns.map(
				(
					{
						key,
						name,
						className,
						onRenderColumnHeader = nullFn,
						isSortable = false,
						sortingClassName = null
					}: IPaginatedListColumn,
					idx: number
				) => {
					const classList = cx(
						styles.columnItem,
						styles['columnItem_' + sortingClassName],
						className
					)

					const handleOnClick = () => {
						// Add click only if the column is set to be sortable.
						isSortable && onHeaderClick(key)
					}

					return (
						onRenderColumnHeader(key, name, idx) || (
							<Col key={idx} className={classList} onClick={handleOnClick}>
								{name}
							</Col>
						)
					)
				}
			)}
		</Row>
	)
})
