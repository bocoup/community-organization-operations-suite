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
import { IPaginatedListColumn } from './types'

export const ColumnHeaderRow: StandardFC<{
	columns: IPaginatedListColumn[]
}> = memo(function ColumnHeaderRow({ className, columns }) {
	return (
		<Row className={cx(styles.columnHeaderRow, className)}>
			{columns.map(
				(
					{ key, name, className, onRenderColumnHeader = nullFn }: IPaginatedListColumn,
					idx: number
				) => {
					return (
						onRenderColumnHeader(key, name, idx) || (
							<Col key={idx} className={cx(styles.columnItem, className)}>
								{name}
							</Col>
						)
					)
				}
			)}
		</Row>
	)
})
