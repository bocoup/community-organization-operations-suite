/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import { PaginatedTable } from '~components/ui/PaginatedTable'
import styles from '../../index.module.scss'
import type { CommonReportProps } from '../types'
import { useClientReportFilterHelper } from './useClientReportFilterHelper'
import { useClientReportCsvFields } from './useClientReportCsvFields'
import { useClientReportColumns } from './useClientReportColumns'
import { useClientReportFilters } from './useClientReportFilters'
import { useClientReportData } from './useClientReportData'

export const ClientReport: FC<CommonReportProps> = memo(function ClientReport({
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
	const columns = useClientReportColumns(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		hiddenFields
	)
	useClientReportData(setUnfilteredData, setFilteredData)
	useClientReportFilters(fieldFilters, setFieldFilters)
	useClientReportCsvFields(setCsvFields, getDemographicValue, hiddenFields)
	useClientReportFilterHelper(setFilterHelper)

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
			overFlowActiveClassName={styles.overFlowActive}
			isLoading={false}
		/>
	)
})
