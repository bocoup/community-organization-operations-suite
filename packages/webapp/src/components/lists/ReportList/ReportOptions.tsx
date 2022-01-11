/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { FC, memo, useCallback, useState, useEffect, useMemo } from 'react'
import { Col, Row } from 'react-bootstrap'
import { IconButton } from '~components/ui/IconButton'
import { OptionType, ReactSelect } from '~components/ui/ReactSelect'
import { ShowFieldsFilter, FieldData } from '~components/ui/ShowFieldsFilter'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { IDropdownOption } from '@fluentui/react'
import { ReportType } from './types'
import { Service } from '@cbosuite/schema/dist/client-types'

export interface FilterOptions {
	onChange?: (filterValue: OptionType) => void
	options: OptionType[]
	className?: string
	fieldName?: string | Array<string>
}

export const ReportOptions: FC<{
	type: ReportType
	title: string
	isMD?: boolean
	numRows?: number
	showExportButton: boolean
	reportOptions: OptionType[]
	reportOptionsDefaultInputValue?: string
	selectedService?: Service
	unfilteredData?: unknown[]
	filterOptions?: FilterOptions
	onReportOptionChange: (value: ReportType) => void
	onExportDataButtonClick?: () => void
	onShowFieldsChange?: (value: IDropdownOption) => void
	fieldData?: FieldData[]
	hiddenFields: Record<string, boolean>
}> = memo(function ReportOptions({
	type,
	title,
	isMD = true,
	numRows,
	showExportButton,
	reportOptions,
	reportOptionsDefaultInputValue,
	filterOptions,
	fieldData,
	selectedService,
	onReportOptionChange,
	onExportDataButtonClick,
	onShowFieldsChange,
	hiddenFields
}) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Requests)

	const handleReportOptionChanged = useCallback(
		(option: OptionType) => {
			onReportOptionChange(option?.value)
		},
		[onReportOptionChange]
	)

	const requestOptions: IDropdownOption[] = useMemo(
		() => [
			{
				key: 'title',
				text: t('requestListColumns.title')
			},
			{
				key: 'description',
				text: t('requestListColumns.description')
			},
			{
				key: 'startDate',
				text: t('requestListColumns.startDate')
			},
			{
				key: 'endDate',
				text: t('requestListColumns.endDate')
			},
			{
				key: 'status',
				text: t('requestListColumns.status')
			},
			{
				key: 'specialist',
				text: t('requestListColumns.specialist')
			}
		],
		[t]
	)
	const contactOptions: IDropdownOption[] = useMemo(
		() => [
			{
				key: 'name',
				text: t('clientList.columns.name')
			},
			{
				key: 'gender',
				text: t('demographics.gender.label')
			},
			{
				key: 'dateOfBirth',
				text: t('customFilters.birthdate')
			},
			{
				key: 'race',
				text: t('demographics.race.label')
			},
			{
				text: t('demographics.ethnicity.label'),
				key: 'ethnicity'
			},
			{
				text: t('demographics.preferredLanguage.label'),
				key: 'preferredLanguage'
			},
			{
				text: t('demographics.preferredContactMethod.label'),
				key: 'preferredContactMethod'
			},
			{
				text: t('demographics.preferredContactTime.label'),
				key: 'preferredContactTime'
			},
			{
				text: t('customFilters.street'),
				key: 'street'
			},
			{
				text: t('customFilters.unit'),
				key: 'unit'
			},
			{
				text: t('customFilters.city'),
				key: 'city'
			},
			{
				text: t('customFilters.county'),
				key: 'county'
			},
			{
				text: t('customFilters.state'),
				key: 'state'
			},
			{
				text: t('customFilters.zip'),
				key: 'zip'
			}
		],
		[t]
	)

	const [showFieldFilters, setShowFieldFilters] = useState<IDropdownOption[]>(contactOptions)
	const [showFieldFiltersSelected, setShowFieldFiltersSelected] = useState<string[]>([])

	useEffect(() => {
		if (type === ReportType.SERVICES && selectedService) {
			const fields = selectedService.fields.map((field) => ({
				text: field.name,
				key: field.id
			}))

			if (selectedService.contactFormEnabled) setShowFieldFilters(contactOptions.concat(fields))
			else setShowFieldFilters(fields)
		} else if (type === ReportType.REQUESTS) {
			setShowFieldFilters(contactOptions.concat(requestOptions))
		} else if (type === ReportType.CLIENTS) {
			setShowFieldFilters(contactOptions)
		}
	}, [contactOptions, selectedService, requestOptions, type, setShowFieldFilters])

	useEffect(() => {
		setShowFieldFiltersSelected(
			showFieldFilters
				.filter((field) => !hiddenFields[field.key])
				.map((field) => field.key) as string[]
		)
	}, [showFieldFilters, hiddenFields, setShowFieldFiltersSelected])

	return (
		<Col className={cx(isMD ? null : 'ps-2')}>
			<Row className={cx('mb-3', 'align-items-end')}>
				<Col md={3} xs={12}>
					<div>
						<h2 className='mb-3'>{title}</h2>
						<div>
							{reportOptionsDefaultInputValue && (
								<ReactSelect
									options={reportOptions}
									defaultValue={reportOptions[0]}
									onChange={handleReportOptionChanged}
								/>
							)}
						</div>
					</div>
				</Col>
				<Col md={6} xs={12}>
					<Row>
						{filterOptions && (
							<Col md={6} xs={12} className='mt-3 mb-0 mb-md-0'>
								<ReactSelect {...filterOptions} />
							</Col>
						)}
					</Row>
				</Col>
				<Col xs={3} className='d-flex justify-content-end align-items-center'>
					<ShowFieldsFilter
						options={showFieldFilters}
						selected={showFieldFiltersSelected}
						onChange={onShowFieldsChange}
					>
						<IconButton icon='Equalizer' text={t('showFieldsButton')} />
					</ShowFieldsFilter>

					{showExportButton ? (
						<>
							<IconButton
								icon='DrillDownSolid'
								text={`${t('exportButton')} (${numRows} ${numRows > 0 ? 'rows' : 'row'})`}
								onClick={onExportDataButtonClick}
							/>
						</>
					) : null}
				</Col>
			</Row>
		</Col>
	)
})
