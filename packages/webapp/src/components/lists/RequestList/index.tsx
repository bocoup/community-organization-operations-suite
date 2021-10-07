/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState } from 'react'
import { EditRequestForm } from '~forms/EditRequestForm'
import { useWindowSize } from '~hooks/useWindowSize'
import { Panel } from '~ui/Panel'
import { StandardFC } from '~types/StandardFC'
import { Engagement, EngagementInput } from '@cbosuite/schema/dist/client-types'
import { PaginatedList } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'
import { useMobileColumns, usePageColumns } from './columns'
import { useEngagementSearchHandler } from '~hooks/useEngagementSearchHandler'

interface RequestListProps {
	title: string
	requests?: Engagement[]
	loading?: boolean
	onPageChange?: (items: Engagement[], currentPage: number) => void
	onEdit?: (form: any) => void
	onClaim?: (form: any) => void
}

export const RequestList: StandardFC<RequestListProps> = wrap(function RequestList({
	title,
	requests,
	loading,
	onEdit = noop,
	onClaim = noop,
	onPageChange = noop
}) {
	const { t } = useTranslation('requests')
	const { isMD } = useWindowSize()
	const [isEditFormOpen, { setTrue: openEditRequestPanel, setFalse: dismissEditRequestPanel }] =
		useBoolean(false)
	const [filteredList, setFilteredList] = useState<Engagement[]>(requests)
	const [selectedEngagement, setSelectedEngagement] = useState<Engagement | undefined>()
	const searchList = useEngagementSearchHandler(requests, setFilteredList)

	const handleEdit = useCallback(
		(values: EngagementInput) => {
			dismissEditRequestPanel()
			onEdit(values)
		},
		[onEdit, dismissEditRequestPanel]
	)

	const handleOnEdit = useCallback(
		(engagement: Engagement) => {
			setSelectedEngagement(engagement)
			openEditRequestPanel()
		},
		[setSelectedEngagement, openEditRequestPanel]
	)

	const pageColumns = usePageColumns(onClaim, handleOnEdit)
	const mobileColumn = useMobileColumns(onClaim, handleOnEdit)

	return (
		<>
			<div className={cx('mt-5 mb-5', styles.requestList, 'requestList')}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={isMD ? 10 : 5}
					columns={isMD ? pageColumns : mobileColumn}
					hideListHeaders={!isMD}
					rowClassName={isMD ? 'align-items-center' : undefined}
					onSearchValueChange={searchList}
					onPageChange={onPageChange}
					isLoading={loading}
					isMD={isMD}
					collapsible
					collapsibleStateName='isRequestsListOpen'
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissEditRequestPanel}>
				<EditRequestForm
					title={t('requestEditButton')}
					engagement={selectedEngagement}
					onSubmit={handleEdit}
				/>
			</Panel>
		</>
	)
})
