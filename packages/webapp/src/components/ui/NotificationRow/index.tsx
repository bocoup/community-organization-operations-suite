/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import type { Mention } from '@resolve/schema/lib/client-types'
import formatTimeFromToday from '~utils/formatTimeFromToday'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import Icon from '~ui/Icon'
import ShortString from '~ui/ShortString'

interface NotificationRowProps extends ComponentProps {
	mention: Mention
	actionIndex: number
	clickCallback?: () => void
	dismissCallback?: () => void
}

const NotificationRow = memo(function NotificationRow({
	mention,
	actionIndex,
	clickCallback,
	dismissCallback
}: NotificationRowProps): JSX.Element {
	const { c } = useTranslation()

	const engagementAction = mention.engagement.actions[actionIndex]

	const dismissItem = ev => {
		dismissCallback?.()
		ev.stopPropagation()
	}

	return (
		<div
			className={cx(styles.notificationRow, !mention.seen && styles.unRead)}
			onClick={() => clickCallback?.()}
		>
			<div className='text-muted mb-2'>{formatTimeFromToday(mention.createdAt)}</div>
			<Icon className={styles.dismissIcon} iconName='Cancel' onClick={ev => dismissItem(ev)} />
			{mention?.createdBy ? (
				<>
					<div className='mb-2'>
						<span className='text-primary'>
							{mention.createdBy.name.first} {mention.createdBy.name.last}
						</span>{' '}
						mentioned you in{' '}
						<span className={styles.description}>
							<ShortString
								text={mention?.engagement?.description}
								limit={30}
								showReadMoreLess={false}
							/>
						</span>{' '}
						request.
					</div>
					<div className={cx('mb-3', styles.comment)}>"{engagementAction?.comment}"</div>
				</>
			) : (
				c('notification.row.defaultText')
			)}
		</div>
	)
})
export default NotificationRow
