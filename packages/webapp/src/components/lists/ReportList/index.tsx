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
import { useReportTypeOptions, useTopRowFilterOptions, useGetValue } from './hooks'
import { ReportType } from './types'
import { empty } from '~utils/noop'
import { ReportOptions } from './ReportOptions'
import { Report } from './reports/Report'
import { useFilteredData } from './useFilteredData'
import { useCsvExport } from './useCsvExport'
import { usePrinter } from './usePrinter'
import { IDropdownOption } from '@fluentui/react'
import { useRecoilState } from 'recoil'
import { hiddenReportFieldsState, selectedReportTypeState } from '~store'
interface ReportListProps {
	title?: string
}

export const ReportList: StandardFC<ReportListProps> = wrap(function ReportList({ title }) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Services)

	// Data & Filtering
	const [unfilteredData, setUnfilteredData] = useState<unknown[]>(empty)
	const [filteredData, setFilteredData] = useState<unknown[]>(empty)
	const [hiddenFields, setHiddenFields] = useRecoilState(hiddenReportFieldsState)
	const {
		clearFilters,
		clearFilter,
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		fieldFilters,
		setFieldFilters,
		setFilterHelper
	} = useFilteredData(unfilteredData, setFilteredData)
	// Exporting
	const { downloadCSV, setCsvFields, csvFields } = useCsvExport(filteredData)
	const { print } = usePrinter()

	// Top-row options
	const [reportType, setReportType] = useRecoilState(selectedReportTypeState)
	const reportTypeOptions = useReportTypeOptions()
	const [selectedService, reportFilterOptions] = useTopRowFilterOptions(reportType)
	const handleReportTypeChange = useCallback(
		(reportType: ReportType) => {
			setUnfilteredData(empty)
			setFilteredData(empty)
			setCsvFields(empty)
			setReportType(reportType)
			setHiddenFields({})
			clearFilters()
		},
		[setUnfilteredData, setFilteredData, setCsvFields, clearFilters, setHiddenFields, setReportType]
	)

	const handleShowFieldsChange = useCallback(
		(fieldOption: IDropdownOption) => {
			if (!fieldOption.selected) {
				const _hiddenFields = { ...hiddenFields, [fieldOption.key]: true }
				setHiddenFields(_hiddenFields)
				clearFilter(fieldOption.key as string)
			} else {
				const _hiddenFields = { ...hiddenFields, [fieldOption.key]: undefined }
				setHiddenFields(_hiddenFields)
			}
		},
		[setHiddenFields, hiddenFields, clearFilter]
	)

	const handlePrint = useCallback(() => {
		const printableData = []
		const printableFields = csvFields.map((field) => field.label)

		for (const data of filteredData) {
			const printableDataItem = {}

			for (const field of csvFields) {
				printableDataItem[field.label] = field.value(data) ?? ''
			}

			printableData.push(printableDataItem)
		}

		print(printableData, printableFields)
	}, [csvFields, filteredData, print])

	return (
		<>
			<div className={cx('mt-5 mb-5', styles.serviceList, 'reportList')}>
				<ReportOptions
					title={title}
					reportOptions={reportTypeOptions}
					type={reportType}
					filterOptions={reportFilterOptions}
					reportOptionsDefaultInputValue={t('clientsTitle')}
					showExportButton={true}
					onReportOptionChange={handleReportTypeChange}
					onShowFieldsChange={handleShowFieldsChange}
					onExportDataButtonClick={downloadCSV}
					onPrintButtonClick={handlePrint}
					numRows={filteredData.length}
					unfilteredData={unfilteredData}
					selectedService={selectedService}
					hiddenFields={hiddenFields}
				/>
				<div id='reportList'>
					<Report
						type={reportType}
						data={filteredData}
						service={selectedService}
						hiddenFields={hiddenFields}
						setFilteredData={setFilteredData}
						setUnfilteredData={setUnfilteredData}
						setCsvFields={setCsvFields}
						{...{
							filterColumns,
							filterColumnTextValue,
							filterRangedValues,
							getDemographicValue,
							fieldFilters,
							setFieldFilters,
							setFilterHelper
						}}
					/>
				</div>
			</div>
		</>
	)
})
