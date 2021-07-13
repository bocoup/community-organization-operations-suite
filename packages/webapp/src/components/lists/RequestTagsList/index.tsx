/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import cx from 'classnames'
import { useRecoilValue } from 'recoil'
import { organizationState } from '~store'
import { Tag } from '@resolve/schema/lib/client-types'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
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
import UserCardRow from '~components/ui/UserCardRow'
import { Col, Row } from 'react-bootstrap'
//import { Parser, FieldInfo } from 'json2csv'
import { useReports } from '~hooks/api/useReports'
import { useTranslation } from '~hooks/useTranslation'

interface RequestTagsListProps extends ComponentProps {
	title?: string
}

const RequestTagsList = memo(function RequestTagsList({
	title
}: RequestTagsListProps): JSX.Element {
	const { t } = useTranslation('requestTags')
	const org = useRecoilValue(organizationState)
	const { data: engagementExportData } = useReports()

	const { isMD } = useWindowSize()
	const [filteredList, setFilteredList] = useState<Tag[]>(org?.tags || [])
	const [isNewFormOpen, { setTrue: openNewTagPanel, setFalse: dismissNewTagPanel }] =
		useBoolean(false)
	const [isEditFormOpen, { setTrue: openEditTagPanel, setFalse: dismissEditTagPanel }] =
		useBoolean(false)
	const [selectedTag, setSelectedTag] = useState<Tag>(null)

	const searchText = useRef<string>('')

	useEffect(() => {
		setFilteredList(org?.tags)
	}, [org?.tags])

	const searchList = useCallback(
		(searchStr: string) => {
			if (searchStr === '') {
				setFilteredList(org?.tags)
			} else {
				const filteredTags = org?.tags.filter(
					(tag: Tag) =>
						tag?.label.toLowerCase().indexOf(searchStr) > -1 ||
						tag?.description?.toLowerCase().indexOf(searchStr) > -1
				)
				setFilteredList(filteredTags)
			}

			searchText.current = searchStr
		},
		[org?.tags, searchText]
	)

	const columnActionButtons: IMultiActionButtons<Tag>[] = [
		{
			name: t('requestTag.list.rowActions.edit'),
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
			name: t('requestTag.list.columns.tag'),
			onRenderColumnItem: function onRenderColumnItem(tag: Tag) {
				return <TagBadge tag={tag} />
			}
		},
		{
			key: 'description',
			name: t('requestTag.list.columns.description'),
			className: 'col-md-4',
			onRenderColumnItem: function onRenderColumnItem(tag: Tag) {
				return <ShortString text={tag.description} limit={isMD ? 64 : 24} />
			}
		},
		{
			key: 'totalUsage',
			name: t('requestTag.list.columns.totalUsage'),
			onRenderColumnItem: function onRenderColumnItem(tag: Tag) {
				const totalUses = (tag?.usageCount?.actions || 0) + (tag?.usageCount?.engagement || 0)
				return <>{totalUses}</>
			}
		},
		{
			key: 'numOfActions',
			name: t('requestTag.list.columns.numOfActions'),
			onRenderColumnItem: function onRenderColumnItem(tag: Tag) {
				return <>{tag?.usageCount?.actions || 0}</>
			}
		},
		{
			key: 'numOfEngagements',
			name: t('requestTag.list.columns.numOfEngagements'),
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

	const mobileColumn: IPaginatedListColumn[] = [
		{
			key: 'cardItem',
			name: 'cardItem',
			onRenderColumnItem: function onRenderColumnItem(tag: Tag, index: number) {
				const totalUses = (tag?.usageCount?.actions || 0) + (tag?.usageCount?.engagement || 0)
				return (
					<UserCardRow
						key={index}
						title={tag.label}
						titleLink='/'
						body={
							<Col className='ps-1 pt-2'>
								<Row className='ps-2 pb-2'>{tag.description}</Row>
								<Row className='ps-2 pb-2 pt-2'>{t('requestTag.list.columns.usageCounts')}:</Row>
								<Row className='ps-2'>
									<Col>
										<Row>{t('requestTag.list.columns.total')}</Row>
										<Row>{totalUses}</Row>
									</Col>
									<Col>
										<Row>{t('requestTag.list.columns.actions')}</Row>
										<Row>{tag?.usageCount?.actions || 0}</Row>
									</Col>
									<Col>
										<Row>{t('requestTag.list.columns.engagements')}</Row>
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

	const downloadFile = () => {
		// const csvFields: FieldInfo<Tag>[] = [
		// 	{
		// 		label: 'Tag Name',
		// 		value: (row: Tag) => row.label
		// 	},
		// 	{
		// 		label: 'Description',
		// 		value: (row: Tag) => row.description
		// 	},
		// 	{
		// 		label: 'Total uses',
		// 		value: (row: Tag) => (row?.usageCount?.actions || 0) + (row?.usageCount?.engagement || 0)
		// 	},
		// 	{
		// 		label: '# of Actions',
		// 		value: (row: Tag) => row?.usageCount?.actions || 0
		// 	},
		// 	{
		// 		label: '# of Engagements',
		// 		value: (row: Tag) => row?.usageCount?.engagement || 0
		// 	}
		// ]

		// const csvParser = new Parser({ fields: csvFields })
		// const csv = csvParser.parse(org.tags)
		// const csvData = new Blob([csv], { type: 'text/csv' })
		// const csvURL = URL.createObjectURL(csvData)
		// window.open(csvURL)

		const filename = 'engagements.json'
		const contentType = 'application/json;charset=utf-8;'

		const a = document.createElement('a')
		a.download = filename
		a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(engagementExportData))
		a.target = '_blank'

		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5')}>
				{isMD ? (
					<PaginatedList
						title={title}
						list={filteredList}
						itemsPerPage={20}
						columns={pageColumns}
						rowClassName='align-items-center'
						addButtonName={t('requestTag.addButton')}
						onSearchValueChange={value => searchList(value)}
						onListAddButtonClick={() => openNewTagPanel()}
						exportButtonName={t('requestTag.exportButton')}
						onExportDataButtonClick={() => downloadFile()}
					/>
				) : (
					<PaginatedList
						list={filteredList}
						itemsPerPage={10}
						columns={mobileColumn}
						hideListHeaders={true}
						addButtonName={t('requestTag.addButton')}
						onSearchValueChange={value => searchList(value)}
						onListAddButtonClick={() => openNewTagPanel()}
					/>
				)}
				<Panel openPanel={isNewFormOpen} onDismiss={() => dismissNewTagPanel()}>
					<AddTagForm
						title={t('requestTag.addButton')}
						orgId={org?.id}
						closeForm={() => dismissNewTagPanel()}
					/>
				</Panel>
				<Panel openPanel={isEditFormOpen} onDismiss={() => dismissEditTagPanel()}>
					<EditTagForm
						title={t('requestTag.editButton')}
						orgId={org?.id}
						tag={selectedTag}
						closeForm={() => dismissEditTagPanel()}
					/>
				</Panel>
			</div>
		</ClientOnly>
	)
})
export default RequestTagsList
