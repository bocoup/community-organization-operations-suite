/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { FC, memo, useCallback } from 'react'
import { Col, Row } from 'react-bootstrap'
import { IconButton } from '~components/ui/IconButton'
import { OptionType, ReactSelect } from '~components/ui/ReactSelect'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { ReportType } from './types'

export interface FilterOptions {
	onChange?: (filterValue: OptionType) => void
	options: OptionType[]
	className?: string
	fieldName?: string | Array<string>
}

export const ReportOptions: FC<{
	title: string
	isMD?: boolean
	showExportButton: boolean
	reportOptions: OptionType[]
	reportOptionsDefaultInputValue?: string
	filterOptions?: FilterOptions
	onReportOptionChange: (value: ReportType) => void
	onExportDataButtonClick?: () => void
}> = memo(function ReportOptions({
	title,
	isMD = true,
	showExportButton,
	reportOptions,
	reportOptionsDefaultInputValue,
	filterOptions,
	onReportOptionChange,
	onExportDataButtonClick
}) {
	const { t } = useTranslation(Namespace.Reporting)
	const handleReportOptionChanged = useCallback(
		(option: OptionType) => {
			onReportOptionChange(option?.value)
		},
		[onReportOptionChange]
	)
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
				<Col xs={3} className='d-flex justify-content-end'>
					{showExportButton ? (
						<IconButton
							icon='DrillDownSolid'
							text={t('exportButton')}
							onClick={onExportDataButtonClick}
						/>
					) : null}
				</Col>
			</Row>
		</Col>
	)
})
