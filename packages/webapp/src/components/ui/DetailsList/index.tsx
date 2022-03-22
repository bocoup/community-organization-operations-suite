/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn, IDetailsListProps } from '@fluentui/react'
import { DetailsList, DetailsListLayoutMode } from '@fluentui/react'
import cx from 'classnames'
import { memo, useCallback } from 'react'
import { IconButton } from '../IconButton'
import { useWindowSize } from '~hooks/useWindowSize'
import type { StandardFC } from '~types/StandardFC'
import { DetailsListTitle } from '~ui/DetailsListTitle'
import { noop, nullFn } from '~utils/noop'

export interface DetailsListProps {
	title?: string
	onRenderRow?: IDetailsListProps['onRenderRow']
	columns?: IColumn[]
	items?: unknown[]
	layoutMode?: number
	onItemClicked?: (any) => void
	responsive?: boolean
	topMargin?: boolean
	className?: string
	onAdd?: () => void
	addLabel: string
	addItemComponent?: JSX.Element
}

export const List: StandardFC<DetailsListProps> = memo(function List({
	title,
	onRenderRow = nullFn,
	columns,
	items,
	layoutMode = DetailsListLayoutMode.justified,
	onItemClicked = noop,
	className,
	topMargin = true,
	responsive = true,
	onAdd = noop,
	addItemComponent,
	addLabel
}) {
	const { isLG } = useWindowSize()

	const handleAddClick = useCallback(() => {
		onAdd()
	}, [onAdd])

	return (
		<div className={cx(topMargin && 'mt-5', className)}>
			<div className='d-flex justify-content-between'>
				{!!title && <DetailsListTitle>{title}</DetailsListTitle>}
				{!!onAdd && !addItemComponent && (
					<IconButton icon='CircleAdditionSolid' onClick={handleAddClick} text={addLabel} />
				)}
				{!!addItemComponent && addItemComponent}
			</div>
			<DetailsList
				isHeaderVisible={!responsive ? true : isLG}
				items={items}
				columns={columns}
				setKey='set'
				layoutMode={layoutMode}
				checkboxVisibility={2}
				onItemInvoked={onItemClicked}
				onRenderRow={onRenderRow}
				useReducedRowRenderer={true} // TODO: this reduces re-render, but could cause issues later
			/>
		</div>
	)
})
