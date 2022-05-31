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
import { ComboButton } from '~components/ui/ComboButton'
import type { IButtonProps } from '~components/ui/ComboButton'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useHistory } from 'react-router-dom'
import { navigate } from '~utils/navigate'
import { ApplicationRoute } from '~types/ApplicationRoute'
import { useOffline } from '~hooks/useOffline'

function generateButton(className: string, text: string, onClick: () => void): IButtonProps {
	return {
		key: text,
		text,
		className,
		onActionClick: onClick
	}
}

export function useColumns(onServiceClose: (service: Service) => void, isKiosk: boolean) {
	const { t } = useTranslation(Namespace.Services)
	const { isMD } = useWindowSize()
	const history = useHistory()
	const { isAdmin } = useCurrentUser()
	const isOffline = useOffline()

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
						const startButtonOnClick = () =>
							navigate(history, ApplicationRoute.ServiceEntry, { sid: service.id })
						const startButton = generateButton(
							styles.actionButton,
							t('serviceListRowActions.start'),
							startButtonOnClick
						)

						const startKioskButtonOnClick = () =>
							navigate(history, ApplicationRoute.ServiceEntryKiosk, { sid: service.id }, true)
						const startKioskButton = generateButton(
							styles.actionButton,
							t('serviceListRowActions.startKiosk'),
							startKioskButtonOnClick
						)

						const columnActionButtons: Array<IButtonProps> = [startKioskButton]

						if (isAdmin && !isOffline) {
							const editButtonOnClick = () =>
								navigate(history, ApplicationRoute.EditService, { sid: service.id })
							const editButton = generateButton(
								styles.actionButton,
								t('serviceListRowActions.edit'),
								editButtonOnClick
							)

							const archiveButtonOnClick = () => onServiceClose(service)
							const archiveButton = generateButton(
								styles.actionButton,
								t('serviceListRowActions.archive'),
								archiveButtonOnClick
							)

							columnActionButtons.push(editButton, archiveButton)
						}

						return (
							<>
								<ComboButton mainButton={startButton} menuOptions={columnActionButtons} />
							</>
						)
					}
				}
			)
		}
		return columns
	}, [t, isMD, isKiosk, history, isAdmin, isOffline, onServiceClose])
}
