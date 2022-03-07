/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import { DeleteServiceRecordModal } from '~components/ui/DeleteServiceRecordModal'
import { FormGenerator } from '~components/ui/FormGenerator'
import { PaginatedTable } from '~components/ui/PaginatedTable'
import { Panel } from '~components/ui/Panel'
import { useServiceReportColumns } from './useServiceReportColumns'
import styles from '../../index.module.scss'
import type { CommonReportProps } from '../types'
import { useServiceReportFilterHelper } from './useServiceReportFilterHelper'
import { useServiceReportCsvFields } from './useServiceReportCsvFields'
import { useServiceReportData } from './useServiceReportData'
import { useServiceReportFilters } from './useServiceReportFilters'
import { useEditState } from './useEditState'
import { useDeleteState } from './useDeleteState'

export const ServiceReport: FC<CommonReportProps> = memo(function ClientReport({
	data,
	service,
	filterColumns,
	filterColumnTextValue,
	filterRangedValues,
	getDemographicValue,
	setFilteredData,
	setFilterHelper,
	setUnfilteredData,
	setCsvFields,
	fieldFilters,
	setFieldFilters,
	hiddenFields
}) {
	const { loading, deleteServiceAnswer, updateServiceAnswer } = useServiceReportData(
		service,
		setUnfilteredData,
		setFilteredData
	)
	useServiceReportFilters(fieldFilters, setFieldFilters, service)
	useServiceReportCsvFields(service, setCsvFields, getDemographicValue, hiddenFields)
	useServiceReportFilterHelper(setFilterHelper)

	const { isEditShown, edited, hideEdit, handleEdit, handleUpdate } = useEditState(
		data,
		setUnfilteredData,
		updateServiceAnswer
	)
	const { isDeleteShown, hideDelete, handleDelete, handleConfirmDelete } = useDeleteState(
		data,
		setUnfilteredData,
		setFilteredData,
		deleteServiceAnswer
	)
	const columns = useServiceReportColumns(
		service,
		data,
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		handleEdit,
		handleDelete,
		hiddenFields
	)

	return (
		<>
			<PaginatedTable
				className={styles.reportList}
				list={data}
				itemsPerPage={20}
				columns={columns}
				tableClassName={styles.reportTable}
				headerRowClassName={styles.headerRow}
				bodyRowClassName={styles.bodyRow}
				paginatorContainerClassName={styles.paginatorContainer}
				overFlowActiveClassName={styles.overFlowActive}
				isLoading={loading}
			/>
			<DeleteServiceRecordModal
				showModal={isDeleteShown}
				onSubmit={handleConfirmDelete}
				onDismiss={hideDelete}
			/>
			<Panel openPanel={isEditShown} onDismiss={hideEdit}>
				<FormGenerator
					service={service}
					record={edited?.record}
					previewMode={false}
					editMode={true}
					onSubmit={handleUpdate}
				/>
			</Panel>
		</>
	)
})
