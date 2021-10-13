/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useEffect, useCallback } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Service } from '@cbosuite/schema/dist/client-types'
import cx from 'classnames'
import { wrap } from '~utils/appinsights'
import { Parser } from 'json2csv/dist/json2csv.umd'
import { useTranslation } from '~hooks/useTranslation'
import { downloadFile } from '~utils/downloadFile'
import {
	useActiveServices,
	useFilterHelpers,
	useReportFilterOptions,
	useReportTypeOptions
} from './hooks'
import { CsvField, IFieldFilter, ReportType } from './types'
import { empty, noop } from '~utils/noop'
import { FilterOptions, ReportOptions } from './ReportOptions'
import { Report } from './reports/Report'
import { FilterHelper } from './reports/types'

interface ReportListProps {
	title?: string
}

export const ReportList: StandardFC<ReportListProps> = wrap(function ReportList({ title }) {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	const [reportType, setReportType] = useState<ReportType>(ReportType.CLIENTS)
	const [unfilteredData, setUnfilteredData] = useState<unknown[]>(empty)
	const [filteredData, setFilteredData] = useState<unknown[]>(empty)
	const [fieldFilters, setFieldFilters] = useState<IFieldFilter[]>(empty)
	const [reportHeaderFilters, setReportHeaderFilters] = useState<IFieldFilter[]>(empty)
	const [filterHelper, setFilterHelper] = useState<{ helper: FilterHelper } | null>(null)
	const [csvFields, setCsvFields] = useState<Array<CsvField>>(empty)

	// Top-row options
	const reportTypeOptions = useReportTypeOptions()
	const [selectedService, reportFilterOption] = useTopRowFilterOptions(reportType)

	const { filterColumns, filterRangedValues, filterColumnTextValue, getDemographicValue } =
		useFilterHelpers(fieldFilters, setReportHeaderFilters)

	useEffect(() => {
		if (!reportHeaderFilters.some(({ value }) => (value as string[] | number[]).length > 0)) {
			setFilteredData(unfilteredData)
		} else if (filterHelper != null) {
			let _filteredAnswers = unfilteredData
			reportHeaderFilters.forEach((filter) => {
				if (filter) {
					_filteredAnswers = filterHelper.helper(_filteredAnswers, filter)
					setFilteredData(_filteredAnswers)
				}
			})
		}
	}, [reportHeaderFilters, reportType, filterHelper, unfilteredData])

	const downloadCSV = useCallback(
		function downloadCSV() {
			const csvParser = new Parser({ fields: csvFields })
			const csv = csvParser.parse(filteredData)
			const csvData = new Blob([csv], { type: 'text/csv' })
			const csvURL = URL.createObjectURL(csvData)
			downloadFile(csvURL)
		},
		[filteredData, csvFields]
	)
	const handleReportTypeChange = useCallback(
		(reportType: ReportType) => {
			setUnfilteredData(empty)
			setFilteredData(empty)
			setReportHeaderFilters(empty)
			setCsvFields(empty)
			setReportType(reportType)
		},
		[setUnfilteredData, setFilteredData, setReportHeaderFilters]
	)

	return (
		<>
			<div className={cx('mt-5 mb-5', styles.serviceList, 'reportList')}>
				<ReportOptions
					title={title}
					reportOptions={reportTypeOptions}
					filterOptions={reportFilterOption}
					reportOptionsDefaultInputValue={t('clientsTitle')}
					showExportButton={true}
					onReportOptionChange={handleReportTypeChange}
					onExportDataButtonClick={downloadCSV}
				/>
				<Report
					type={reportType}
					data={filteredData}
					service={selectedService}
					fieldFilters={fieldFilters}
					setFieldFilters={setFieldFilters}
					setFilteredData={setFilteredData}
					filterColumnTextValue={filterColumnTextValue}
					filterColumns={filterColumns}
					filterRangedValues={filterRangedValues}
					getDemographicValue={getDemographicValue}
					setUnfilteredData={setUnfilteredData}
					setFilterHelper={setFilterHelper}
					setCsvFields={noop}
				/>
			</div>
		</>
	)
})

function useTopRowFilterOptions(reportType: ReportType): [Service, FilterOptions] {
	const { activeServices } = useActiveServices()
	const [selectedService, setSelectedService] = useState<Service | null>(null)
	const [reportFilterOption, setReportFilterOption] = useState<FilterOptions | null>(null)
	const serviceFilterOptions = useReportFilterOptions(activeServices, setSelectedService)

	useEffect(() => {
		// Update Header options
		if (reportType === ReportType.SERVICES) {
			setReportFilterOption(serviceFilterOptions)
		} else if (reportType === ReportType.CLIENTS) {
			setReportFilterOption(null)
			setSelectedService(null)
		}
	}, [reportType, setReportFilterOption, serviceFilterOptions])

	return [selectedService, reportFilterOption]
}
