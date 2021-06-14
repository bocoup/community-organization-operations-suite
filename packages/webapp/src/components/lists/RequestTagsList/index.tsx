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
import React, { useState } from 'react'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import TagBadge from '~components/ui/TagBadge'
import ClientOnly from '~components/ui/ClientOnly'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import Panel from '~components/ui/Panel'
import { useBoolean } from '@fluentui/react-hooks'
import AddTagForm from '~components/forms/AddTagForm'

interface RequestTagsListProps extends ComponentProps {
	title?: string
}

export default function RequestTagsList({ title }: RequestTagsListProps): JSX.Element {
	const org = useRecoilValue(organizationState)
	const [filteredList, setFilteredList] = useState<Tag[]>(org.tags)
	const [isNewFormOpen, { setTrue: openNewTagPanel, setFalse: dismissNewTagPanel }] = useBoolean(
		false
	)

	const columnActionButtons: IMultiActionButtons<Tag>[] = [
		{
			name: 'Edit',
			className: cx(styles.editButton),
			onActionClick: function onActionClick(tag: Tag) {
				console.log(tag)
			}
		}
	]

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
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'w-100 d-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(tag: Tag) {
				return <MultiActionButton columnItem={tag} buttonGroup={columnActionButtons} />
			}
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5')}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={20}
					columns={pageColumns}
					rowClassName='align-items-center'
					addButtonName='New Tag'
					onListAddButtonClick={() => openNewTagPanel()}
				/>
				<Panel openPanel={isNewFormOpen} onDismiss={() => dismissNewTagPanel()}>
					<AddTagForm title='New Tag' closeForm={() => dismissNewTagPanel()} />
				</Panel>
			</div>
		</ClientOnly>
	)
}
