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
import { useCallback, useEffect, useRef, useState } from 'react'
import { PaginatedList, IPaginatedListColumn } from '~ui/PaginatedList'
import { TagBadge } from '~ui/TagBadge'
import { MultiActionButton, IMultiActionButtons } from '~ui/MultiActionButton2'
import { Panel } from '~ui/Panel'
import { useBoolean } from '@fluentui/react-hooks'
import { AddTagForm } from '~forms/AddTagForm'
import { ShortString } from '~ui/ShortString'
import { useWindowSize } from '~hooks/useWindowSize'
import { EditTagForm } from '~forms/EditTagForm'
import { UserCardRow } from '~ui/UserCardRow'
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from '~hooks/useTranslation'
import { TAG_CATEGORIES } from '~constants'
import { OptionType } from '~ui/ReactSelect'
import { wrap } from '~utils/appinsights'
import { createLogger } from '~utils/createLogger'
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
	const searchText = useRef<string>('')

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

	const searchList = useCallback(
		(searchStr: string) => {
			if (searchStr === '') {
				// Clear search
				setFilteredList(org?.tags)
			} else {
				// Filter tags based on search term
				const filteredTags = org?.tags.filter(
					(tag: Tag) =>
						tag?.label.toLowerCase().indexOf(searchStr.toLowerCase()) > -1 ||
						tag?.description?.toLowerCase().indexOf(searchStr.toLowerCase()) > -1
				)
				setFilteredList(filteredTags || [])
			}

			searchText.current = searchStr
		},
		[org?.tags, searchText]
	)

	const filterOptions = {
		options: TAG_CATEGORIES.map((cat) => ({ label: c(`tagCategory.${cat}`), value: cat })),
		onChange: filterList
	}

	const columnActionButtons: IMultiActionButtons<Tag>[] = [
		{
			name: t('requestTagListRowActions.edit'),
			className: cx(styles.editButton),
			onActionClick(tag: Tag) {
				setSelectedTag(tag)
				openEditTagPanel()
			}
		}
	]

	const pageColumns: IPaginatedListColumn[] = [
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
				const totalUses = (tag?.usageCount?.actions || 0) + (tag?.usageCount?.engagement || 0)
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
			key: 'actionColumn',
			name: '',
			className: 'w-100 d-flex justify-content-end',
			onRenderColumnItem(tag: Tag) {
				return <MultiActionButton columnItem={tag} buttonGroup={columnActionButtons} />
			}
		}
	]

	const mobileColumn: IPaginatedListColumn[] = [
		{
			key: 'cardItem',
			name: 'cardItem',
			onRenderColumnItem(tag: Tag, index: number) {
				const totalUses = (tag?.usageCount?.actions || 0) + (tag?.usageCount?.engagement || 0)
				return (
					<UserCardRow
						key={index}
						title={tag.label}
						titleLink='/'
						body={
							<Col className='ps-1 pt-2'>
								<Row className='ps-2 pb-2'>
									<Col className='g-0'>
										<strong>{c(`tagCategory.${tag.category ?? TagCategory.Other}`)}</strong>
									</Col>
								</Row>
								{tag.description && <Row className='ps-2 pb-2'>{tag.description}</Row>}
								<Row className='ps-2 pb-2 pt-2'>{t('requestTag.list.columns.usageCounts')}:</Row>
								<Row className='ps-2'>
									<Col>
										<Row>{t('requestTagListColumns.total')}</Row>
										<Row>{totalUses}</Row>
									</Col>
									<Col>
										<Row>{t('requestTagListColumns.actions')}</Row>
										<Row>{tag?.usageCount?.actions || 0}</Row>
									</Col>
									<Col>
										<Row>{t('requestTagListColumns.engagements')}</Row>
										<Row>{tag?.usageCount?.engagement || 0}</Row>
									</Col>
									<Col className={cx('d-flex justify-content-end')}>
										<MultiActionButton columnItem={tag} buttonGroup={columnActionButtons} />
									</Col>
								</Row>
							</Col>
						}
						onClick={() => {
							setSelectedTag(tag)
							openEditTagPanel()
						}}
					/>
				)
			}
		}
	]

	// const downloadFile = () => {
	// 	// const csvFields: FieldInfo<Tag>[] = [
	// 	// 	{
	// 	// 		label: 'Tag Name',
	// 	// 		value: (row: Tag) => row.label
	// 	// 	},
	// 	// 	{
	// 	// 		label: 'Description',
	// 	// 		value: (row: Tag) => row.description
	// 	// 	},
	// 	// 	{
	// 	// 		label: 'Total uses',
	// 	// 		value: (row: Tag) => (row?.usageCount?.actions || 0) + (row?.usageCount?.engagement || 0)
	// 	// 	},
	// 	// 	{
	// 	// 		label: '# of Actions',
	// 	// 		value: (row: Tag) => row?.usageCount?.actions || 0
	// 	// 	},
	// 	// 	{
	// 	// 		label: '# of Engagements',
	// 	// 		value: (row: Tag) => row?.usageCount?.engagement || 0
	// 	// 	}
	// 	// ]

	// 	// const csvParser = new Parser({ fields: csvFields })
	// 	// const csv = csvParser.parse(org.tags)
	// 	// const csvData = new Blob([csv], { type: 'text/csv' })
	// 	// const csvURL = URL.createObjectURL(csvData)
	// 	// window.open(csvURL)

	// 	const filename = 'engagements.json'
	// 	const contentType = 'application/json;charset=utf-8;'

	// 	const a = document.createElement('a')
	// 	a.download = filename
	// 	a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(engagementExportData))
	// 	a.target = '_blank'

	// 	document.body.appendChild(a)
	// 	a.click()
	// 	document.body.removeChild(a)
	// }

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
					onSearchValueChange={(value) => searchList(value)}
					onListAddButtonClick={openNewTagPanel}
					// exportButtonName={st('requestTagExportButton')}
					// onExportDataButtonClick={() => downloadFile()}
				/>
			) : (
				<PaginatedList
					list={filteredList}
					itemsPerPage={10}
					columns={mobileColumn}
					hideListHeaders={true}
					addButtonName={t('requestTagAddButton')}
					filterOptions={filterOptions}
					onSearchValueChange={(value) => searchList(value)}
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
					orgId={org?.id}
					tag={selectedTag}
					closeForm={dismissEditTagPanel}
				/>
			</Panel>
		</div>
	)
})
