/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Service } from '@cbosuite/schema/dist/client-types'
import ClientOnly from '~components/ui/ClientOnly'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { OptionType } from '~ui/ReactSelect'
import { Dropdown, FontIcon } from '@fluentui/react'
import { Col } from 'react-bootstrap'

interface ServiceReportListProps extends ComponentProps {
	title?: string
	services?: Service[]
	loading?: boolean
}

const ServiceReportList = memo(function ServiceReportList({
	title,
	services = [],
	loading
}: ServiceReportListProps): JSX.Element {
	const [filteredList, setFilteredList] = useState<Service[]>([])

	const setSelectedService = (selectedService: OptionType) => {
		setFilteredList([services.find((s) => s.id === selectedService.value)])
	}

	const filterOptions = {
		options: services.map((service) => ({ label: service.name, value: service.id })),
		onChange: setSelectedService
	}

	const pageColumns: IPaginatedListColumn[] = filteredList[0]?.customFields?.map(
		(field, index) => ({
			key: `${field.fieldName.replaceAll(' ', '_')}-__key`,
			name: field.fieldName,
			onRenderColumnHeader: function onRenderColumnHeader() {
				const ddFieldType = ['singleChoice', 'multiChoice', 'multiText']
				if (ddFieldType.includes(field.fieldType)) {
					return (
						<Col key={index} className={cx('g-0', styles.columnHeader)}>
							<Dropdown
								placeholder={field.fieldName}
								multiSelect
								options={field.fieldValue.map((value) => ({ key: value, text: value }))}
								styles={{
									root: {
										maxWidth: '200px !important',
										marginTop: 10
									},
									dropdown: {
										fontSize: 14,
										fontWeight: 600,
										border: 'none',
										':focus': {
											':after': {
												border: 'none'
											}
										}
									},
									title: {
										color: 'var(--bs-black)',
										border: 'none',
										paddingLeft: 14
									},
									dropdownItemsWrapper: {
										border: '1px solid var(--bs-gray-4)',
										borderRadius: 4
									},
									dropdownItem: {
										fontSize: 14
									},
									dropdownItemSelected: {
										fontSize: 14
									},
									dropdownItemSelectedAndDisabled: {
										fontSize: 14
									}
								}}
								onRenderTitle={() => <>{field.fieldName}</>}
								onRenderCaretDown={() => (
									<FontIcon iconName='FilterSolid' style={{ fontSize: '14px' }} />
								)}
							/>
						</Col>
					)
				}
				return (
					<Col key={index} className={cx('g-0', styles.columnHeader, styles.plainFieldHeader)}>
						{field.fieldName}
					</Col>
				)
			}
		})
	)

	// pageColumns?.push({
	// 	key: 'actions',
	// 	name: '',
	// 	onRenderColumnHeader: function onRenderColumnHeader() {
	// 		return <Col key={pageColumns.length + 1} className='g-0' />
	// 	}
	// })

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5', styles.serviceList)}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={10}
					columns={pageColumns}
					rowClassName={'align-items-center'}
					filterOptions={filterOptions}
					showSearch={false}
					isLoading={loading}
				/>
			</div>
		</ClientOnly>
	)
})
export default ServiceReportList
