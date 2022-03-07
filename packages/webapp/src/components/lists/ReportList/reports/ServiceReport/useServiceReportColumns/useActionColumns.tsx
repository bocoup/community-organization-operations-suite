/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import type { ServiceAnswer } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import type { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { MultiActionButton } from '~components/ui/MultiActionButton2'
import type { IPaginatedTableColumn } from '~components/ui/PaginatedTable/types'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import styles from '../../../index.module.scss'

export function useActionColumns(
	handleEdit: (record: ServiceAnswer) => void,
	handleDelete: (record: ServiceAnswer) => void
): IPaginatedTableColumn[] {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Services)
	return useMemo(
		() => [
			{
				key: 'actions',
				name: '',
				headerClassName: cx(styles.headerItemCell, styles.actionItemHeader),
				itemClassName: cx(styles.itemCell, styles.actionItemCell),
				onRenderColumnItem(item: ServiceAnswer) {
					const columnActionButtons: IMultiActionButtons<ServiceAnswer>[] = [
						{
							name: t('serviceListRowActions.edit'),
							className: cx(styles.editButton),
							onActionClick: handleEdit
						},
						{
							name: t('serviceListRowActions.delete'),
							className: cx(styles.editButton),
							onActionClick: handleDelete
						}
					]
					return (
						<div className={styles.actionItemButtonsWrapper}>
							<MultiActionButton columnItem={item} buttonGroup={columnActionButtons} />
						</div>
					)
				},
				isSortable: false
			}
		],
		[handleEdit, handleDelete, t]
	)
}
