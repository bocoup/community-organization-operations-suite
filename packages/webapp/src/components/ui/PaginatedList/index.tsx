/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { PaginatedList as Paginator } from 'react-paginated-list'

interface PaginatedListProps extends ComponentProps {
	title?: string
	list: any[]
	itemsPerPage: number
	renderListItem: (item: any, id: number) => JSX.Element
}

export default function PaginatedList({
	list,
	itemsPerPage,
	renderListItem
}: PaginatedListProps): JSX.Element {
	return (
		<Paginator
			list={list}
			itemsPerPage={itemsPerPage}
			renderList={(items: any) => (
				<>
					{items.map((item: any, id: number) => {
						return renderListItem(item, id)
					})}
				</>
			)}
		/>
	)
}
