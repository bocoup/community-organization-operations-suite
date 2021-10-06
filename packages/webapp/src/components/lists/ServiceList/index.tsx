/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useEffect, useCallback, useMemo } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { PaginatedList, IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { Service, Tag } from '@cbosuite/schema/dist/client-types'
import { CardRowTitle } from '~components/ui/CardRowTitle'
import { ShortString } from '~ui/ShortString'
import { useWindowSize } from '~hooks/useWindowSize'
import { TagBadge } from '~components/ui/TagBadge'
import { MultiActionButton, IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useHistory } from 'react-router-dom'
import { noop } from '~utils/noop'
import { HighContrastSelectorWhite } from '@fluentui/style-utilities'
import { navigate } from '~utils/navigate'

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
	const { t } = useTranslation('services')
	const { isAdmin } = useCurrentUser()
	const handleAddService = useHandleAddService(isAdmin)
	useEffect(() => {
		if (services) {
			setFilteredList(services)
		}
	}, [services])

	const searchList = useCallback(
		(searchStr: string) => {
			// TODO: implement search query
			const filteredServiceList = services.filter(
				(s: Service) =>
					s.name.toLowerCase().includes(searchStr.toLowerCase()) ||
					s.description.toLowerCase().includes(searchStr.toLowerCase()) ||
					s.tags?.some((t: Tag) => t.label.toLowerCase().includes(searchStr.toLowerCase()))
			)
			setFilteredList(filteredServiceList)
		},
		[services]
	)
	const pageColumns = useColumns(onServiceClose)

	return (
		<div className={cx('mt-5 mb-5', styles.serviceList)} data-testid='service-list'>
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
			history.push(`${history.location.pathname}/addService`)
		}
	}, [history, isAdmin])
}

function useColumns(onServiceClose: (service: Service) => void) {
	const { t } = useTranslation('services')
	const { isMD } = useWindowSize()
	const history = useHistory()
	const { isAdmin } = useCurrentUser()

	const columnActionButtons = useMemo<Array<IMultiActionButtons<Service>>>(() => {
		const result = [
			{
				name: t('serviceListRowActions.start'),
				className: cx(styles.actionButton),
				onActionClick(service: Service) {
					navigate(history, `${history.location.pathname}/serviceKiosk`, { sid: service.id })
				}
			}
		]

		if (isAdmin) {
			result.push(
				{
					name: t('serviceListRowActions.edit'),
					className: cx(styles.actionButton),
					onActionClick(service: Service) {
						navigate(history, `${history.location.pathname}/editService`, { sid: service.id })
					}
				},
				{
					name: t('serviceListRowActions.archive'),
					className: cx(styles.actionButton),
					onActionClick(service: Service) {
						onServiceClose(service)
					}
				}
			)
		}
		return result
	}, [onServiceClose, isAdmin, history, t])

	return useMemo<IPaginatedListColumn[]>(
		() => [
			{
				key: 'name',
				name: t('serviceListColumns.name'),
				className: 'col-2',
				onRenderColumnItem(service: Service) {
					return <CardRowTitle tag='span' title={service.name} titleLink='/' />
				}
			},
			{
				key: 'description',
				name: t('serviceListColumns.description'),
				className: 'col-4',
				onRenderColumnItem(service: Service) {
					return <ShortString text={service.description} limit={isMD ? 64 : 24} />
				}
			},
			{
				key: 'tags',
				name: t('serviceListColumns.tags'),
				className: 'col-3',
				onRenderColumnItem(service: Service) {
					if (service?.tags) {
						return service.tags.map((attr, idx) => {
							return <TagBadge key={idx} tag={{ id: attr.id, label: attr.label }} />
						})
					}

					return <></>
				}
			},
			{
				key: 'actions',
				name: '',
				className: 'd-flex justify-content-end',
				onRenderColumnItem(service: Service) {
					return <MultiActionButton columnItem={service} buttonGroup={columnActionButtons} />
				}
			}
		],
		[t, isMD, columnActionButtons]
	)
}
