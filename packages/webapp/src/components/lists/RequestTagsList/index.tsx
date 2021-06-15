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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import TagBadge from '~components/ui/TagBadge'
import ClientOnly from '~components/ui/ClientOnly'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import Panel from '~components/ui/Panel'
import { useBoolean } from '@fluentui/react-hooks'
import AddTagForm from '~components/forms/AddTagForm'
import ShortString from '~components/ui/ShortString'
import useWindowSize from '~hooks/useWindowSize'
import EditTagForm from '~components/forms/EditTagForm'

interface RequestTagsListProps extends ComponentProps {
	title?: string
}

export default function RequestTagsList({ title }: RequestTagsListProps): JSX.Element {
	const org = useRecoilValue(organizationState)
	const { isMD } = useWindowSize()
	const [filteredList, setFilteredList] = useState<Tag[]>(org.tags)
	const [isNewFormOpen, { setTrue: openNewTagPanel, setFalse: dismissNewTagPanel }] = useBoolean(
		false
	)
	const [isEditFormOpen, { setTrue: openEditTagPanel, setFalse: dismissEditTagPanel }] = useBoolean(
		false
	)
	const [selectedTag, setSelectedTag] = useState<Tag>(null)

	const searchText = useRef<string>('')

	useEffect(() => {
		setFilteredList(org.tags)
	}, [org.tags])

	const searchList = useCallback(
		(searchStr: string) => {
			if (searchStr === '') {
				setFilteredList(org.tags)
			} else {
				const filteredTags = org.tags.filter(
					(tag: Tag) =>
						tag?.label.toLowerCase().indexOf(searchStr) > -1 ||
						tag?.description?.toLowerCase().indexOf(searchStr) > -1
				)
				setFilteredList(filteredTags)
			}

			searchText.current = searchStr
		},
		[org.tags, searchText]
	)

	const columnActionButtons: IMultiActionButtons<Tag>[] = [
		{
			name: 'Edit',
			className: cx(styles.editButton),
			onActionClick: function onActionClick(tag: Tag) {
				setSelectedTag(tag)
				openEditTagPanel()
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
			className: 'col-md-4',
			onRenderColumnItem: function onRenderColumnItem(tag: Tag) {
				return <ShortString text={tag.description} limit={isMD ? 64 : 24} />
			}
		},
		{
			key: 'totalUsage',
			name: 'Total uses',
			onRenderColumnItem: function onRenderColumnItem(tag: Tag) {
				const totalUses = (tag?.usageCount?.actions || 0) + (tag?.usageCount?.engagement || 0)
				return <>{totalUses}</>
			}
		},
		{
			key: 'numOfActions',
			name: '# of Actions',
			onRenderColumnItem: function onRenderColumnItem(tag: Tag) {
				return <>{tag?.usageCount?.actions || 0}</>
			}
		},
		{
			key: 'numOfEngagements',
			name: '# of Engagements',
			onRenderColumnItem: function onRenderColumnItem(tag: Tag) {
				return <>{tag?.usageCount?.engagement || 0}</>
			}
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
					onSearchValueChange={value => searchList(value)}
					onListAddButtonClick={() => openNewTagPanel()}
				/>
				<Panel openPanel={isNewFormOpen} onDismiss={() => dismissNewTagPanel()}>
					<AddTagForm title='New Tag' orgId={org.id} closeForm={() => dismissNewTagPanel()} />
				</Panel>
				<Panel openPanel={isEditFormOpen} onDismiss={() => dismissEditTagPanel()}>
					<EditTagForm
						title='Edit Tag'
						orgId={org.id}
						tag={selectedTag}
						closeForm={() => dismissEditTagPanel()}
					/>
				</Panel>
			</div>
		</ClientOnly>
	)
}
