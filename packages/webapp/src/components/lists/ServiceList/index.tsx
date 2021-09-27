/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useState, useEffect, useCallback } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import ClientOnly from '~ui/ClientOnly'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { Service, Tag } from '@cbosuite/schema/lib/client-types'
import CardRowTitle from '~components/ui/CardRowTitle'
import ShortString from '~ui/ShortString'
import useWindowSize from '~hooks/useWindowSize'
import TagBadge from '~components/ui/TagBadge'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useHistory } from 'react-router-dom'

interface ServiceListProps extends ComponentProps {
	title?: string
	services?: Service[]
	loading?: boolean
	onServiceClose?: (service: Service) => void
}

const ServiceList = memo(function ServiceList({
	title,
	services = [],
	loading,
	onServiceClose
}: ServiceListProps): JSX.Element {
	const [filteredList, setFilteredList] = useState<Service[]>(services)
	const history = useHistory()
	const { isMD } = useWindowSize()
	const { t } = useTranslation('services')
	const { isAdmin } = useCurrentUser()

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

	const columnActionButtons: IMultiActionButtons<Service>[] = [
		{
			name: t('serviceListRowActions.start'),
			className: cx(styles.actionButton),
			onActionClick: function onActionClick(service: Service) {
				history.push(
					`${history.location.pathname}/serviceKiosk?sid=${service.id}`,
					history.location.state
				)
			}
		}
	]

	if (isAdmin) {
		columnActionButtons.push(
			{
				name: t('serviceListRowActions.edit'),
				className: cx(styles.actionButton),
				onActionClick: function onActionClick(service: Service) {
					history.push(
						`${history.location.pathname}/editService?sid=${service.id}`,
						history.location.state
					)
				}
			},
			{
				name: t('serviceListRowActions.archive'),
				className: cx(styles.actionButton),
				onActionClick: function onActionClick(service: Service) {
					onServiceClose?.(service)
				}
			}
		)
	}

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: t('serviceListColumns.name'),
			className: 'col-2',
			onRenderColumnItem: function onRenderColumnItem(service: Service) {
				return <CardRowTitle tag='span' title={service.name} titleLink='/' onClick={() => null} />
			}
		},
		{
			key: 'description',
			name: t('serviceListColumns.description'),
			className: 'col-4',
			onRenderColumnItem: function onRenderColumnItem(service: Service) {
				return <ShortString text={service.description} limit={isMD ? 64 : 24} />
			}
		},
		{
			key: 'tags',
			name: t('serviceListColumns.tags'),
			className: 'col-3',
			onRenderColumnItem: function onRenderColumnItem(service: Service) {
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
			onRenderColumnItem: function onRenderColumnItem(service: Service) {
				return <MultiActionButton columnItem={service} buttonGroup={columnActionButtons} />
			}
		}
	]

	const onAddServiceClick = () => {
		history.push(`${history.location.pathname}/addService`, history.location.state)
	}

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5', styles.serviceList)}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={10}
					columns={pageColumns}
					rowClassName={'align-items-center'}
					addButtonName={isAdmin ? t('serviceListAddButton') : undefined}
					onListAddButtonClick={isAdmin ? () => onAddServiceClick() : undefined}
					onSearchValueChange={searchList}
					isLoading={loading}
				/>
			</div>
		</ClientOnly>
	)
})
export default wrap(ServiceList)
