/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import cx from 'classnames'
import { useRecoilValue } from 'recoil'
import { organizationState } from '~store'
import { Tag, TagCategory } from '@cbosuite/schema/dist/client-types'
import { useCallback, useEffect, useState } from 'react'
import { PaginatedList } from '~ui/PaginatedList'
import { IMultiActionButtons } from '~ui/MultiActionButton2'
import { Panel } from '~ui/Panel'
import { useBoolean } from '@fluentui/react-hooks'
import { AddTagForm } from '~forms/AddTagForm'
import { useWindowSize } from '~hooks/useWindowSize'
import { EditTagForm } from '~forms/EditTagForm'
import { useTranslation } from '~hooks/useTranslation'
import { TAG_CATEGORIES } from '~constants'
import { OptionType } from '~ui/ReactSelect'
import { wrap } from '~utils/appinsights'
import { createLogger } from '~utils/createLogger'
import { useTagSearchHandler } from '~hooks/useTagSearchHandler'
import { useMobileColumns, usePageColumns } from './columns'
const logger = createLogger('tagsList')

interface TagsListProps {
	title?: string
}

export const TagsList: StandardFC<TagsListProps> = wrap(function TagsList({ title }) {
	const { t, c } = useTranslation('tags')
	const org = useRecoilValue(organizationState)

	const { isMD } = useWindowSize()
	const [filteredList, setFilteredList] = useState<Tag[]>(org?.tags || [])
	const [isNewFormOpen, { setTrue: openNewTagPanel, setFalse: dismissNewTagPanel }] =
		useBoolean(false)
	const [isEditFormOpen, { setTrue: openEditTagPanel, setFalse: dismissEditTagPanel }] =
		useBoolean(false)
	const [selectedTag, setSelectedTag] = useState<Tag>(null)

	useEffect(() => {
		setFilteredList(org?.tags || [])
	}, [org?.tags])

	/**
	 * Filter tag list
	 */
	const filterList = (filterOption: OptionType) => {
		logger('filterOption', filterOption)
		if (!filterOption?.value) {
			logger('filterOption', filterOption)
		}
		const value = filterOption?.value
		let filteredTags: Tag[]

		if (!value || value === 'ALL' || value === '') {
			// Show all org tags
			filteredTags = org?.tags
		} else if (value === TagCategory.Other) {
			// Show tags without category or other
			filteredTags = org?.tags.filter((tag: Tag) => !tag.category || tag.category === value)
		} else {
			// Filter on selected category
			filteredTags = org?.tags.filter((tag: Tag) => tag.category === value)
		}

		setFilteredList(filteredTags || [])
	}

	const searchList = useTagSearchHandler(org?.tags || [], setFilteredList)

	const onTagClick = useCallback(
		(tag: Tag) => {
			setSelectedTag(tag)
			openEditTagPanel()
		},
		[openEditTagPanel, setSelectedTag]
	)
	const filterOptions = {
		options: TAG_CATEGORIES.map((cat) => ({ label: c(`tagCategory.${cat}`), value: cat })),
		onChange: filterList
	}

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

	const pageColumns = usePageColumns(actions)
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
					filterOptions={filterOptions}
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
					filterOptions={filterOptions}
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
