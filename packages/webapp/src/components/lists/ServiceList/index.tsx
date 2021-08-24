/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useEffect } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import ClientOnly from '~ui/ClientOnly'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'

interface ServiceListProps extends ComponentProps {
	title?: string
	services?: any[]
	loading?: boolean
}

const ServiceList = memo(function ServiceList({
	title,
	services = [],
	loading
}: ServiceListProps): JSX.Element {
	const [filteredList, setFilteredList] = useState<any[]>(services)

	useEffect(() => {
		if (services) {
			setFilteredList(services)
		}
	}, [services])

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: 'Name',
			className: 'col-2'
		},
		{
			key: 'description',
			name: 'Description',
			className: 'col-4'
		},
		{
			key: 'tags',
			name: 'Tags',
			className: 'col-4'
		},
		{
			key: 'actions',
			name: '',
			className: 'd-flex justify-content-end'
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5', styles.serviceList)}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={10}
					columns={pageColumns}
					rowClassName={'align-items-center'}
					addButtonName={'New Service'}
					onListAddButtonClick={() => null}
					//onSearchValueChange={searchList}
					isLoading={loading}
				/>
			</div>
		</ClientOnly>
	)
})
export default ServiceList
