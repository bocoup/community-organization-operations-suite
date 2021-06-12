/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import cx from 'classnames'
import { useRecoilValue } from 'recoil'
import { organizationState } from '~store'
import { Tag } from '@greenlight/schema/lib/client-types'
import { useState } from 'react'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import TagBadge from '~components/ui/TagBadge'

interface RequestTagsListProps extends ComponentProps {
	title?: string
}

export default function RequestTagsList({ title }: RequestTagsListProps): JSX.Element {
	const org = useRecoilValue(organizationState)

	const sortedList = Object.values(org.tags).sort((a, b) =>
		a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
	)

	const [filteredList, setFilteredList] = useState<Tag[]>(sortedList)

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'tag',
			name: 'Tag',
			onRenderColumnItem: function onRenderColumnItem(tag: Tag) {
				return <TagBadge tag={tag} />
			}
		},
		{
			key: 'description',
			name: 'Description',
			fieldName: 'Lorem ipsum'
		},
		{
			key: 'numOfActions',
			name: '# of Actions',
			fieldName: 'usageCount.actions'
		},
		{
			key: 'numOfEngagements',
			name: '# of Engagements',
			fieldName: 'usageCount.engagement'
		}
	]

	return (
		<div className={cx('mt-5 mb-5')}>
			<PaginatedList
				title={title}
				list={filteredList}
				itemsPerPage={20}
				columns={pageColumns}
				rowClassName='align-items-center'
				addButtonName='New Tag'
				//onSearchValueChange={value => searchList(value)}
				//onListAddButtonClick={() => openNewSpecialistPanel()}
			/>
		</div>
	)
}
