/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Tag } from '@cbosuite/schema/dist/client-types'
import { TagCategory } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import type { IPaginatedListColumn } from '~ui/PaginatedList'
import { TagBadge } from '~ui/TagBadge'
import type { IMultiActionButtons } from '~ui/MultiActionButton2'
import { MultiActionButton } from '~ui/MultiActionButton2'
import { ShortString } from '~ui/ShortString'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { MobileCard } from './MobileCard'
import { CustomOptionsFilter } from '~components/ui/CustomOptionsFilter'
import type { CustomOption } from '~components/ui/CustomOptionsFilter'
import { TAG_CATEGORIES } from '~constants'

export function usePageColumns(
	actions: IMultiActionButtons<Tag>[],
	filterListByCategory?: (filterOption: CustomOption) => void
): IPaginatedListColumn[] {
	const { t, c } = useTranslation(Namespace.Tags)
	return useMemo(
		() => [
			{
				key: 'tag',
				name: t('requestTagListColumns.tag'),
				onRenderColumnItem(tag: Tag) {
					return (
						<div style={{ width: 100 }}>
							<TagBadge tag={tag} />
						</div>
					)
				}
			},
			{
				key: 'description',
				name: t('requestTagListColumns.description'),
				className: 'col-md-2',
				onRenderColumnItem(tag: Tag) {
					return <ShortString text={tag.description} limit={64} />
				}
			},
			{
				key: 'category',
				name: t('requestTagListColumns.category'),
				onRenderColumnItem(tag: Tag) {
					const group = tag?.category ?? TagCategory.Other
					return <>{c(`tagCategory.${group}`)}</>
				},
				onRenderColumnHeader(key, name) {
					return (
						<CustomOptionsFilter
							placeholder={name}
							options={TAG_CATEGORIES.map((category, index) => {
								return {
									key: category,
									text: c(`tagCategory.${category}`)
								}
							})}
							onFilterChanged={(option) => filterListByCategory(option)}
						/>
					)
				}
			},
			{
				key: 'totalUsage',
				name: t('requestTagListColumns.totalUsage'),
				onRenderColumnItem(tag: Tag) {
					const totalUses = tag?.usageCount?.total ?? 0
					return <>{totalUses}</>
				}
			},
			{
				key: 'numOfServices',
				name: t('requestTagListColumns.numOfServices'),
				onRenderColumnItem(tag: Tag) {
					return <>{tag?.usageCount?.serviceEntries || 0}</>
				}
			},
			{
				key: 'numOfEngagements',
				name: t('requestTagListColumns.numOfEngagements'),
				onRenderColumnItem(tag: Tag) {
					return <>{tag?.usageCount?.engagements || 0}</>
				}
			},
			{
				key: 'numOfClients',
				name: t('requestTagListColumns.numOfClients'),
				onRenderColumnItem(tag: Tag) {
					return <>{tag?.usageCount?.clients || 0}</>
				}
			},
			{
				key: 'actionColumn',
				name: '',
				className: 'w-100 d-flex justify-content-end',
				onRenderColumnItem(tag: Tag) {
					return <MultiActionButton columnItem={tag} buttonGroup={actions} />
				}
			}
		],
		[actions, t, c, filterListByCategory]
	)
}

export function useMobileColumns(
	actions: IMultiActionButtons<Tag>[],
	onTagClick: (tag: Tag) => void
): IPaginatedListColumn[] {
	return useMemo(
		() => [
			{
				key: 'cardItem',
				name: 'cardItem',
				onRenderColumnItem(tag: Tag) {
					const onClick = () => onTagClick(tag)
					return <MobileCard tag={tag} actions={actions} onClick={onClick} />
				}
			}
		],
		[actions, onTagClick]
	)
}
