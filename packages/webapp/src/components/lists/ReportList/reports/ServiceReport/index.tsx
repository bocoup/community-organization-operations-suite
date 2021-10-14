/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import { DeleteServiceRecordModal } from '~components/ui/DeleteServiceRecordModal'
import { FormGenerator } from '~components/ui/FormGenerator'
import { PaginatedTable } from '~components/ui/PaginatedTable'
import { Panel } from '~components/ui/Panel'
import { useServiceReportColumns } from './useServiceReportColumns'
import styles from '../../index.module.scss'
import { CommonReportProps } from '../types'
import { useServiceReportFilterHelper } from './useServiceReportFilterHelper'
import { useServiceReportCsvFields } from './useServiceReportCsvFields'
import { useServiceReportData } from './useServiceReportData'
import { useServiceReportFilters } from './useServiceReportFilters'
import { useEditState } from './useEditState'
import { useDeleteState } from './useDeleteState'
import { useActiveServices } from '../../useActiveServices'

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
	setFieldFilters
}) {
	const { services, loading, deleteServiceAnswer, updateServiceAnswer } = useActiveServices()
	useServiceReportData(service, setUnfilteredData, setFilteredData)
	useServiceReportFilters(service, setFieldFilters)
	useServiceReportCsvFields(service, setCsvFields, getDemographicValue)
	useServiceReportFilterHelper(setFilterHelper)

	const { isEditShown, edited, hideEdit, handleEdit, handleUpdate } = useEditState(
		services,
		data,
		setUnfilteredData,
		setFilteredData,
		updateServiceAnswer
	)
	const { isDeleteShown, hideDelete, handleDelete, handleConfirmDelete } = useDeleteState(
		services,
		data,
		setUnfilteredData,
		setFilteredData,
		deleteServiceAnswer
	)
	const columns = useServiceReportColumns(
		service,
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		handleEdit,
		handleDelete
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
				isLoading={loading}
			/>
			<DeleteServiceRecordModal
				showModal={isDeleteShown}
				onSubmit={handleConfirmDelete}
				onDismiss={hideDelete}
			/>
			<Panel openPanel={isEditShown} onDismiss={hideEdit}>
				<FormGenerator
					service={edited?.service}
					record={edited?.record}
					previewMode={false}
					editMode={true}
					onSubmit={handleUpdate}
				/>
			</Panel>
		</>
	)
})
