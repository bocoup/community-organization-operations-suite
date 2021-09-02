/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useEffect } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Service } from '@cbosuite/schema/dist/client-types'
import ClientOnly from '~components/ui/ClientOnly'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { OptionType } from '~ui/ReactSelect'
import { Dropdown } from '@fluentui/react'
import { Col, Row } from 'react-bootstrap'

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

	// useEffect(() => {
	// 	if (services) {
	// 		setFilteredList(services)
	// 	}
	// }, [services])

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
				const ddFieldType = ['single-choice', 'multi-choice', 'multi-text']
				if (ddFieldType.includes(field.fieldType)) {
					return (
						<Col key={index} className='g-0'>
							<Dropdown
								placeholder={field.fieldName}
								multiSelect
								options={field.fieldValue.map((value) => ({ key: value, text: value }))}
								styles={{
									root: {
										maxWidth: '200px !important'
									}
								}}
							/>
						</Col>
					)
				}
				return (
					<Col key={index} className='g-0'>
						{field.fieldName}
					</Col>
				)
			}
		})
	)

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
