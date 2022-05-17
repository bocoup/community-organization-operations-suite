/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import styles from './index.module.scss'
import { FontIcon } from '@fluentui/react'
import type { IPaginatedListColumn } from '~components/ui/PaginatedList'
import type { Service } from '@cbosuite/schema/dist/client-types'
import { CardRowTitle } from '~components/ui/CardRowTitle'
import { ShortString } from '~ui/ShortString'
import { useWindowSize } from '~hooks/useWindowSize'
import { TagBadge } from '~components/ui/TagBadge'
import type { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { MultiActionButton } from '~components/ui/MultiActionButton2'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useHistory } from 'react-router-dom'
import { navigate } from '~utils/navigate'
import { ApplicationRoute } from '~types/ApplicationRoute'
import { useOffline } from '~hooks/useOffline'

export function useColumns(onServiceClose: (service: Service) => void, isKiosk: boolean) {
	const { t } = useTranslation(Namespace.Services)
	const { isMD } = useWindowSize()
	const history = useHistory()
	const { isAdmin } = useCurrentUser()
	const isOffline = useOffline()

	const columnActionButtons = useMemo<Array<IMultiActionButtons<Service>>>(() => {
		const result: Array<IMultiActionButtons<Service>> = [
			{
				name: t('serviceListRowActions.start'),
				className: styles.actionButton,
				onActionClick(service: Service) {
					navigate(history, ApplicationRoute.ServiceEntry, { sid: service.id })
				}
			},
			{
				name: t('serviceListRowActions.startKiosk'),
				className: styles.actionButton,
				onActionClick(service: Service) {
					navigate(history, ApplicationRoute.ServiceEntryKiosk, { sid: service.id }, true)
				}
			}
		]

		if (isAdmin) {
			result.push(
				{
					name: t('serviceListRowActions.edit'),
					className: styles.actionButton,
					onActionClick(service: Service) {
						navigate(history, ApplicationRoute.EditService, { sid: service.id })
					},
					isDisabled: isOffline
				},
				{
					name: t('serviceListRowActions.archive'),
					className: styles.actionButton,
					onActionClick(service: Service) {
						onServiceClose(service)
					},
					isDisabled: isOffline
				}
			)
		}
		return result
	}, [onServiceClose, isAdmin, history, t, isOffline])

	return useMemo<IPaginatedListColumn[]>(() => {
		const columns: IPaginatedListColumn[] = [
			{
				key: 'name',
				name: t('serviceListColumns.name'),
				className: isKiosk ? styles.serviceName : 'col-2',
				onRenderColumnItem(service: Service) {
					return (
						<CardRowTitle
							tag='span'
							className='service-title'
							title={service.name}
							titleLink={isKiosk ? null : '/'}
						/>
					)
				}
			}
		]
		if (isKiosk) {
			columns.push({
				key: 'actions',
				name: '',
				className: styles.kioskActionButton,
				onRenderColumnItem(service: Service) {
					return (
						<div
							onClick={() =>
								navigate(history, ApplicationRoute.ServiceEntryKiosk, { sid: service.id })
							}
						>
							<FontIcon iconName='ChevronRightSmall' />
						</div>
					)
				}
			})
		} else {
			columns.push(
				{
					key: 'description',
					name: t('serviceListColumns.description'),
					className: 'col-3',
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
								return (
									<TagBadge key={idx} tag={{ id: attr.id, orgId: attr.orgId, label: attr.label }} />
								)
							})
						}

						return <></>
					}
				},
				{
					key: 'actions',
					name: '',
					className: 'col-4 d-flex flex-wrap justify-content-center',
					onRenderColumnItem(service: Service) {
						return <MultiActionButton columnItem={service} buttonGroup={columnActionButtons} />
					}
				}
			)
		}
		return columns
	}, [t, isMD, isKiosk, columnActionButtons, history])
}
