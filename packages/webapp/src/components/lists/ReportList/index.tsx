/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useCallback } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import cx from 'classnames'
import { wrap } from '~utils/appinsights'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useReportTypeOptions, useTopRowFilterOptions } from './hooks'
import { ReportType } from './types'
import { empty } from '~utils/noop'
import { ReportOptions } from './ReportOptions'
import { Report } from './reports/Report'
import { useFilteredData } from './useFilteredData'
import { useCsvExport } from './useCsvExport'

interface ReportListProps {
	title?: string
}

export const ReportList: StandardFC<ReportListProps> = wrap(function ReportList({ title }) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Services)

	// Data & Filtering
	const [unfilteredData, setUnfilteredData] = useState<unknown[]>(empty)
	const [filteredData, setFilteredData] = useState<unknown[]>(empty)
	const { clearFilters, ...filterUtilities } = useFilteredData(unfilteredData, setFilteredData)

	// Exporting
	const { downloadCSV, setCsvFields } = useCsvExport(filteredData)

	// Top-row options
	const [reportType, setReportType] = useState<ReportType>(ReportType.CLIENTS)
	const reportTypeOptions = useReportTypeOptions()
	const [selectedService, reportFilterOption] = useTopRowFilterOptions(reportType)
	const handleReportTypeChange = useCallback(
		(reportType: ReportType) => {
			setUnfilteredData(empty)
			setFilteredData(empty)
			setCsvFields(empty)
			setReportType(reportType)
			clearFilters()
		},
		[setUnfilteredData, setFilteredData, setCsvFields, clearFilters]
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
					numRows={filteredData.length}
				/>
				<Report
					type={reportType}
					data={filteredData}
					service={selectedService}
					setFilteredData={setFilteredData}
					setUnfilteredData={setUnfilteredData}
					setCsvFields={setCsvFields}
					{...filterUtilities}
				/>
			</div>
		</>
	)
})
