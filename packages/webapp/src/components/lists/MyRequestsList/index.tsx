/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState, useEffect } from 'react'
import { EditRequestForm } from '~forms/EditRequestForm'
import { useWindowSize } from '~hooks/useWindowSize'
import { IMultiActionButtons } from '~ui/MultiActionButton2'
import { Panel } from '~ui/Panel'
import { StandardFC } from '~types/StandardFC'
import type { Engagement, EngagementInput } from '@cbosuite/schema/dist/client-types'
import { PaginatedList } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'
import { useMobileColumns, usePageColumns } from './columns'
import { useEngagementSearchHandler } from '~hooks/useEngagementSearch'
import { useFilterResetOnDataChange } from '~hooks/useFilterResetOnDataChange'

interface MyRequestListProps {
	title: string
	requests: Engagement[]
	loading?: boolean
	onPageChange?: (items: Engagement[], currentPage: number) => void
	onEdit?: (form: any) => void
}

export const MyRequestsList: StandardFC<MyRequestListProps> = wrap(function MyRequestsList({
	title,
	requests,
	loading,
	onEdit = noop,
	onPageChange = noop
}) {
	const { t } = useTranslation('requests')
	const { isMD } = useWindowSize()
	const [isEditFormOpen, { setTrue: openEditRequestPanel, setFalse: dismissEditRequestPanel }] =
		useBoolean(false)

	const [filteredList, setFilteredList] = useState<Engagement[]>(requests)
	const [engagement, setSelectedEngagement] = useState<Engagement | undefined>()

	useFilterResetOnDataChange(requests, setFilteredList)
	const searchList = useEngagementSearchHandler(requests, setFilteredList)

	const handleEdit = (values: EngagementInput) => {
		dismissEditRequestPanel()
		onEdit(values)
	}

	const columnActionButtons: IMultiActionButtons<Engagement>[] = [
		{
			name: t('requestListRowActions.edit'),
			className: cx(styles.editButton),
			onActionClick(engagement: Engagement) {
				setSelectedEngagement(engagement)
				openEditRequestPanel()
			}
		}
	]

	const pageColumns = usePageColumns(columnActionButtons)
	const mobileColumns = useMobileColumns(columnActionButtons)

	return (
		<>
			<div className={cx('mt-5 mb-5', 'myRequestList')}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={isMD ? 10 : 5}
					columns={isMD ? pageColumns : mobileColumns}
					hideListHeaders={!isMD}
					rowClassName={isMD ? 'align-items-center' : undefined}
					onSearchValueChange={searchList}
					onPageChange={onPageChange}
					isLoading={loading}
					isMD={isMD}
					collapsible
					collapsibleStateName='isMyRequestsListOpen'
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissEditRequestPanel}>
				<EditRequestForm
					title={t('requestEditButton')}
					engagement={engagement}
					onSubmit={handleEdit}
				/>
			</Panel>
		</>
	)
})
