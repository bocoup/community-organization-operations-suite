/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo, useCallback, useState, useEffect, useMemo } from 'react'
import { Col, Row } from 'react-bootstrap'
import { IconButton } from '~components/ui/IconButton'
import type { OptionType } from '~components/ui/ReactSelect'
import { ReactSelect } from '~components/ui/ReactSelect'
import { ServiceSelect } from '~components/ui/ServiceSelect'
import type { FieldData } from '~components/ui/ShowFieldsFilter'
import { ShowFieldsFilter } from '~components/ui/ShowFieldsFilter'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import type { IDropdownOption } from '@fluentui/react'
import { DropdownMenuItemType } from '@fluentui/react'
import { ReportType } from './types'
import type { Service } from '@cbosuite/schema/dist/client-types'

export interface FilterOptions {
	onChange?: (filterValue: OptionType) => void
	options: OptionType[]
	className?: string
	fieldName?: string | Array<string>
}

interface ReportOptionsProps {
	type: ReportType
	title: string
	numRows?: number
	showExportButton: boolean
	reportOptions: OptionType[]
	reportOptionsDefaultInputValue?: string
	selectedService?: Service
	unfilteredData?: unknown[]
	filterOptions?: FilterOptions
	onReportOptionChange: (value: ReportType) => void
	onExportDataButtonClick?: () => void
	onPrintButtonClick?: () => void
	onShowFieldsChange?: (value: IDropdownOption) => void
	fieldData?: FieldData[]
	hiddenFields: Record<string, boolean>
}

export const ReportOptions: FC<ReportOptionsProps> = memo(function ReportOptions({
	type,
	title,
	numRows,
	showExportButton,
	reportOptions,
	reportOptionsDefaultInputValue,
	filterOptions,
	fieldData,
	selectedService,
	onReportOptionChange,
	onExportDataButtonClick,
	onPrintButtonClick,
	onShowFieldsChange,
	hiddenFields
}) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Requests)
	const [hiddenFieldsActive, setHiddenFieldsActive] = useState(false)
	const handleReportOptionChanged = useCallback(
		(option: OptionType) => {
			onReportOptionChange(option?.value)
		},
		[onReportOptionChange]
	)

	const defaultRequestOptions: IDropdownOption[] = useMemo(
		() => [
			{
				key: 'title',
				text: t('requestListColumns.title')
			},
			{
				key: 'requestTags',
				text: t('customFilters.requestTags')
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
	const defaultContactOptions: IDropdownOption[] = useMemo(
		() => [
			{
				key: 'name',
				text: t('clientList.columns.name')
			},
			{
				key: 'tags',
				text: t('customFilters.clientTags')
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

	const [showFieldFilters, setShowFieldFilters] = useState<IDropdownOption[]>(defaultContactOptions)
	const [showFieldFiltersSelected, setShowFieldFiltersSelected] = useState<string[]>([])

	// Set show fie
	useEffect(() => {
		if (type === ReportType.SERVICES && selectedService) {
			const serviceOptions =
				selectedService.fields?.map((field) => ({
					text: field.name,
					key: field.id
				})) ?? []

			if (selectedService.contactFormEnabled) {
				setShowFieldFilters([
					{
						key: 'clientHeader',
						text: t('showFieldsHeaderClient'),
						itemType: DropdownMenuItemType.Header
					},
					...defaultContactOptions,
					{
						key: 'serviceHeader',
						text: t('showFieldsHeaderService'),
						itemType: DropdownMenuItemType.Header
					},
					...serviceOptions
				])
			} else {
				setShowFieldFilters(serviceOptions)
			}
		} else if (type === ReportType.REQUESTS) {
			setShowFieldFilters([
				{
					key: 'clientHeader',
					text: t('showFieldsHeaderClient'),
					itemType: DropdownMenuItemType.Header
				},
				...defaultContactOptions,
				{
					key: 'requestHeader',
					text: t('showFieldsHeaderRequest'),
					itemType: DropdownMenuItemType.Header
				},
				...defaultRequestOptions
			])
		} else if (type === ReportType.CLIENTS) {
			setShowFieldFilters(defaultContactOptions)
		}
	}, [defaultContactOptions, selectedService, defaultRequestOptions, type, setShowFieldFilters, t])

	useEffect(() => {
		// Set showFieldsSelected to the saved hidden field values
		setShowFieldFiltersSelected(
			showFieldFilters
				.filter((field) => !hiddenFields?.[field.key])
				.map((field) => field.key) as string[]
		)

		// Set hidden fields active state
		let _hiddenFieldsActive = false
		for (const field of Object.keys(hiddenFields)) {
			if (hiddenFields[field]) {
				_hiddenFieldsActive = true
				break
			}
		}
		setHiddenFieldsActive(_hiddenFieldsActive)
	}, [showFieldFilters, hiddenFields, setShowFieldFiltersSelected])

	const defaultReportType = reportOptions.find((r) => r.value === type) ?? reportOptions[0]
	const defaultSelectedServiceOption: OptionType = selectedService
		? { value: selectedService.id, label: selectedService.name }
		: null

	return (
		<header className='row mb-3 align-items-end'>
			<Col md={3} xs={12}>
				<h2 className='mb-3'>{title}</h2>
				{reportOptionsDefaultInputValue && (
					<ReactSelect
						options={reportOptions}
						defaultValue={defaultReportType}
						onChange={handleReportOptionChanged}
					/>
				)}
			</Col>
			<Col md={6} xs={12}>
				<Row>
					{filterOptions && (
						<Col md={6} xs={12} className='mt-3 mb-0 mb-md-0'>
							{type === ReportType.SERVICES ? (
								<ServiceSelect defaultValue={defaultSelectedServiceOption} {...filterOptions} />
							) : (
								<ReactSelect {...filterOptions} />
							)}
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
					<IconButton active={hiddenFieldsActive} icon='Equalizer' text={t('showFieldsButton')} />
				</ShowFieldsFilter>

				<IconButton icon='print' text={t('printButton')} onClick={onPrintButtonClick} />
				{showExportButton ? (
					<IconButton
						icon='DrillDownSolid'
						text={`${t('exportButton')} (${numRows} ${numRows > 0 ? 'rows' : 'row'})`}
						onClick={onExportDataButtonClick}
					/>
				) : null}
			</Col>
		</header>
	)
})
