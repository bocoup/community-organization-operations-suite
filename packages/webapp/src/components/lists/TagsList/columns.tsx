/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Tag, TagCategory } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { IPaginatedListColumn } from '~ui/PaginatedList'
import { TagBadge } from '~ui/TagBadge'
import { MultiActionButton, IMultiActionButtons } from '~ui/MultiActionButton2'
import { ShortString } from '~ui/ShortString'
import { useTranslation } from '~hooks/useTranslation'
import { useWindowSize } from '~hooks/useWindowSize'
import { MobileCard } from './MobileCard'

export function usePageColumns(actions: IMultiActionButtons<Tag>[]): IPaginatedListColumn[] {
	const { isMD } = useWindowSize()
	const { t, c } = useTranslation('tags')
	return useMemo(
		() => [
			{
				key: 'tag',
				name: t('requestTagListColumns.tag'),
				onRenderColumnItem(tag: Tag) {
					return <TagBadge tag={tag} />
				}
			},
			{
				key: 'description',
				name: t('requestTagListColumns.description'),
				className: 'col-md-4',
				onRenderColumnItem(tag: Tag) {
					return <ShortString text={tag.description} limit={isMD ? 64 : 24} />
				}
			},
			{
				key: 'category',
				name: t('requestTagListColumns.category'),
				className: 'col-md-1',
				onRenderColumnItem(tag: Tag) {
					const group = tag?.category ?? TagCategory.Other
					return <>{c(`tagCategory.${group}`)}</>
				}
			},
			{
				key: 'totalUsage',
				name: t('requestTagListColumns.totalUsage'),
				onRenderColumnItem(tag: Tag) {
					const totalUses =
						(tag?.usageCount?.actions || 0) +
						(tag?.usageCount?.engagement || 0) +
						(tag?.usageCount?.clients || 0)
					return <>{totalUses}</>
				}
			},
			{
				key: 'numOfActions',
				name: t('requestTagListColumns.numOfActions'),
				onRenderColumnItem(tag: Tag) {
					return <>{tag?.usageCount?.actions || 0}</>
				}
			},
			{
				key: 'numOfEngagements',
				name: t('requestTagListColumns.numOfEngagements'),
				onRenderColumnItem(tag: Tag) {
					return <>{tag?.usageCount?.engagement || 0}</>
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
		[actions, t, c, isMD]
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
