/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import cx from 'classnames'
import { useRecoilValue } from 'recoil'
import { organizationState } from '~store'
import type { Tag } from '@cbosuite/schema/dist/client-types'
import { useCallback, useEffect, useState } from 'react'
import { PaginatedList } from '~ui/PaginatedList'
import type { IMultiActionButtons } from '~ui/MultiActionButton2'
import { Panel } from '~ui/Panel'
import { useBoolean } from '@fluentui/react-hooks'
import { AddTagForm } from '~forms/AddTagForm'
import { useWindowSize } from '~hooks/useWindowSize'
import { EditTagForm } from '~forms/EditTagForm'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import type { CustomOption } from '~components/ui/CustomOptionsFilter'
import { wrap } from '~utils/appinsights'
import { useTagSearchHandler } from '~hooks/useTagSearchHandler'
import { useMobileColumns, usePageColumns } from './columns'

interface TagsListProps {
	title?: string
}

export const TagsList: StandardFC<TagsListProps> = wrap(function TagsList({ title }) {
	const { t /*, c*/ } = useTranslation(Namespace.Tags)
	const org = useRecoilValue(organizationState)

	const { isMD } = useWindowSize()
	const [filteredList, setFilteredList] = useState<Tag[]>(org?.tags || [])
	const [isNewFormOpen, { setTrue: openNewTagPanel, setFalse: dismissNewTagPanel }] =
		useBoolean(false)
	const [isEditFormOpen, { setTrue: openEditTagPanel, setFalse: dismissEditTagPanel }] =
		useBoolean(false)
	const [selectedTag, setSelectedTag] = useState<Tag>(null)
	const [selectedCategories, setSelectedCategories] = useState(new Set<string>())

	useEffect(() => {
		setFilteredList(org?.tags || [])
	}, [org?.tags])

	const filterList = (filterOption: CustomOption) => {
		// Keep track of the user selection
		const setCategories = new Set(selectedCategories)
		if (filterOption.selected) {
			setCategories.add(filterOption.key)
		} else {
			setCategories.delete(filterOption.key)
		}
		setSelectedCategories(setCategories)

		// Filter the tag list
		const tags: Tag[] = org?.tags ?? []

		if (setCategories.size > 0) {
			const filteredTags = tags.filter((tag: Tag) => setCategories.has(tag.category))
			setFilteredList(filteredTags)
		} else {
			setFilteredList(tags)
		}
	}

	const clearFilter = () => {
		setSelectedCategories(new Set())
		setFilteredList(org?.tags ?? [])
	}

	const searchList = useTagSearchHandler(org?.tags || [], setFilteredList)

	const onTagClick = useCallback(
		(tag: Tag) => {
			setSelectedTag(tag)
			openEditTagPanel()
		},
		[openEditTagPanel, setSelectedTag]
	)

	const actions: IMultiActionButtons<Tag>[] = [
		{
			name: t('requestTagListRowActions.edit'),
			className: cx(styles.editButton),
			onActionClick(tag: Tag) {
				setSelectedTag(tag)
				openEditTagPanel()
			}
		}
	]

	const pageColumns = usePageColumns(actions, filterList, clearFilter)
	const mobileColumns = useMobileColumns(actions, onTagClick)

	return (
		<div className={cx('mt-5 mb-5 tagList')}>
			{isMD ? (
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={20}
					columns={pageColumns}
					rowClassName='align-items-center'
					addButtonName={t('requestTagAddButton')}
					onSearchValueChange={searchList}
					onListAddButtonClick={openNewTagPanel}
				/>
			) : (
				<PaginatedList
					list={filteredList}
					itemsPerPage={10}
					columns={mobileColumns}
					hideListHeaders={true}
					addButtonName={t('requestTagAddButton')}
					onSearchValueChange={searchList}
					onListAddButtonClick={openNewTagPanel}
				/>
			)}
			<Panel openPanel={isNewFormOpen} onDismiss={dismissNewTagPanel}>
				<AddTagForm
					title={t('requestTagAddButton')}
					orgId={org?.id}
					closeForm={dismissNewTagPanel}
				/>
			</Panel>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissEditTagPanel}>
				<EditTagForm
					title={t('requestTagEditButton')}
					tag={selectedTag}
					closeForm={dismissEditTagPanel}
				/>
			</Panel>
		</div>
	)
})
