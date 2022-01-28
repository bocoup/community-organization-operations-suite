/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import { PaginatedTable } from '~components/ui/PaginatedTable'
import { useRequestReportColumns } from './useRequestReportColumns'
import styles from '../../index.module.scss'
import { CommonReportProps } from '../types'
import { useRequestReportFilterHelper } from './useRequestReportFilterHelper'
import { useRequestReportCsvFields } from './useRequestReportCsvFields'
import { useRequestReportFilters } from './useRequestReportFilters'
import { useRequestReportData } from './useRequestReportData'

export const RequestReport: FC<CommonReportProps> = memo(function RequestReport({
	data,
	filterColumnTextValue,
	filterColumns,
	filterRangedValues,
	getDemographicValue,
	setUnfilteredData,
	setFilteredData,
	setFilterHelper,
	setCsvFields,
	fieldFilters,
	setFieldFilters,
	hiddenFields
}) {
	const columns = useRequestReportColumns(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		hiddenFields
	)

	useRequestReportData(setUnfilteredData, setFilteredData)
	useRequestReportFilters(fieldFilters, setFieldFilters)
	useRequestReportCsvFields(setCsvFields, getDemographicValue, hiddenFields)
	useRequestReportFilterHelper(setFilterHelper)

	return (
		<PaginatedTable
			className={styles.reportList}
			list={data}
			itemsPerPage={20}
			columns={columns}
			tableClassName={styles.reportTable}
			headerRowClassName={styles.headerRow}
			bodyRowClassName={styles.bodyRow}
			paginatorContainerClassName={styles.paginatorContainer}
			isLoading={false}
		/>
	)
})
