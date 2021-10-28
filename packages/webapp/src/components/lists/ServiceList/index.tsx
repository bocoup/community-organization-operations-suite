/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useCallback } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { PaginatedList } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { Service } from '@cbosuite/schema/dist/client-types'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useHistory } from 'react-router-dom'
import { noop } from '~utils/noop'
import { navigate } from '~utils/navigate'
import { useColumns } from './columns'
import { useServiceSearchHandler } from '~hooks/useServiceSearchHandler'
import { ApplicationRoute } from '~types/ApplicationRoute'

interface ServiceListProps {
	title?: string
	services?: Service[]
	loading?: boolean
	onServiceClose?: (service: Service) => void
}

export const ServiceList: StandardFC<ServiceListProps> = wrap(function ServiceList({
	title,
	services = [],
	loading,
	onServiceClose = noop
}) {
	const [filteredList, setFilteredList] = useState<Service[]>(services)
	const { t } = useTranslation(Namespace.Services)
	const { isAdmin } = useCurrentUser()
	const handleAddService = useHandleAddService(isAdmin)
	const searchList = useServiceSearchHandler(services, setFilteredList)
	const pageColumns = useColumns(onServiceClose)

	return (
		<div className={cx('mt-5 mb-5', styles.serviceList, 'serviceList')}>
			<PaginatedList
				title={title}
				list={filteredList}
				itemsPerPage={10}
				columns={pageColumns}
				rowClassName={'align-items-center'}
				addButtonName={isAdmin ? t('serviceListAddButton') : undefined}
				onListAddButtonClick={handleAddService}
				onSearchValueChange={searchList}
				isLoading={loading}
			/>
		</div>
	)
})

function useHandleAddService(isAdmin: boolean) {
	const history = useHistory()
	return useCallback(() => {
		if (isAdmin) {
			navigate(history, ApplicationRoute.AddService)
		}
	}, [history, isAdmin])
}
