/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import styles from './index.module.scss'
import { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { Service } from '@cbosuite/schema/dist/client-types'
import { CardRowTitle } from '~components/ui/CardRowTitle'
import { ShortString } from '~ui/ShortString'
import { useWindowSize } from '~hooks/useWindowSize'
import { TagBadge } from '~components/ui/TagBadge'
import { MultiActionButton, IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useHistory } from 'react-router-dom'
import { navigate } from '~utils/navigate'
import { ApplicationRoute } from '~types/ApplicationRoute'

export function useColumns(onServiceClose: (service: Service) => void) {
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
					navigate(history, ApplicationRoute.ServiceKiosk, { sid: service.id })
				}
			}
		]

		if (isAdmin) {
			result.push(
				{
					name: t('serviceListRowActions.edit'),
					className: cx(styles.actionButton),
					onActionClick(service: Service) {
						navigate(history, ApplicationRoute.EditService, { sid: service.id })
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
					return (
						<CardRowTitle tag='span' className='service-title' title={service.name} titleLink='/' />
					)
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
				className: 'd-flex justify-content-end',
				onRenderColumnItem(service: Service) {
					return <MultiActionButton columnItem={service} buttonGroup={columnActionButtons} />
				}
			}
		],
		[t, isMD, columnActionButtons]
	)
}
