/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { useRecoilValue } from 'recoil'
import { organizationState } from '~store'
import type { Tag } from '@cbosuite/schema/dist/client-types'
import { useCallback, useEffect, useState, useRef } from 'react'
import { PaginatedList } from '~ui/PaginatedList'
import type { IMultiActionButtons } from '~ui/MultiActionButton2'
import { Panel } from '~ui/Panel'
import { useBoolean } from '@fluentui/react-hooks'
import { AddTagForm } from '~forms/AddTagForm'
import { useWindowSize } from '~hooks/useWindowSize'
import { EditTagForm } from '~forms/EditTagForm'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { trackEvent, wrap } from '~utils/appinsights'
import { cleanForSearch } from '~utils/sorting'
import { useMobileColumns, usePageColumns } from './columns'
import { debounce, isEmpty } from 'lodash'
import { useLocation } from 'react-router-dom'

interface TagsListProps {
	title?: string
}

export const TagsList: StandardFC<TagsListProps> = wrap(function TagsList({ title }) {
	const { t } = useTranslation(Namespace.Tags)
	const org = useRecoilValue(organizationState)
	const location = useLocation()

	const { isMD } = useWindowSize()
	const [isNewFormOpen, { setTrue: openNewTagPanel, setFalse: dismissNewTagPanel }] =
		useBoolean(false)
	const [isEditFormOpen, { setTrue: openEditTagPanel, setFalse: dismissEditTagPanel }] =
		useBoolean(false)
	const [selectedTag, setSelectedTag] = useState<Tag>(null)

	const [selectedCategories, setSelectedCategories] = useState<string[]>([])
	const [searchString, setSearchString] = useState<string>('')

	// -- Telemetry
	const handleTrackEvent = () => {
		trackEvent({
			name: 'Search',
			properties: {
				'Organization ID': org.id,
				Page: location?.pathname ?? ''
			}
		})
	}

	const debounceTrackFn = useRef(
		debounce(handleTrackEvent, 1000, {
			leading: true,
			trailing: false
		})
	).current

	useEffect(() => {
		return () => {
			debounceTrackFn.cancel()
		}
	}, [debounceTrackFn])
	// -- end Telemetry

	const searchList = function (value: string) {
		setSearchString(value)
		debounceTrackFn()
	}

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
			className: styles.editButton,
			onActionClick(tag: Tag) {
				setSelectedTag(tag)
				openEditTagPanel()
			}
		}
	]

	// Columns to be displayed
	const pageColumns = usePageColumns(actions, setSelectedCategories)
	const mobileColumns = useMobileColumns(actions, onTagClick)

	// List of tags displayed
	const orgTags = org?.tags ?? []
	const tags: Tag[] = orgTags.filter((tag) => {
		// Filter by category
		let isToBeDisplayed = true
		if (selectedCategories.length > 0) {
			isToBeDisplayed = selectedCategories.includes(tag.category)
		}

		// Search by Label or Description info
		if (isToBeDisplayed && !isEmpty(searchString)) {
			const tagInfo = cleanForSearch([tag?.label, tag?.description].toString())
			return tagInfo.includes(cleanForSearch(searchString))
		}

		return isToBeDisplayed
	})

	return (
		<div className='mt-5 mb-5 tagList'>
			{isMD ? (
				<PaginatedList
					title={title}
					list={tags}
					itemsPerPage={20}
					columns={pageColumns}
					rowClassName='align-items-center'
					addButtonName={t('requestTagAddButton')}
					onSearchValueChange={searchList}
					onListAddButtonClick={openNewTagPanel}
				/>
			) : (
				<PaginatedList
					list={tags}
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
