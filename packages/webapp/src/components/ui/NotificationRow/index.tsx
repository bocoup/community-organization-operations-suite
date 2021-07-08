/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import type { Mention } from '@greenlight/schema/lib/client-types'
import formatTimeFromToday from '~utils/formatTimeFromToday'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

interface NotificationRowProps extends ComponentProps {
	mention: Mention
	clickCallback?: () => void
}

const NotificationRow = memo(function NotificationRow({
	mention,
	clickCallback
}: NotificationRowProps): JSX.Element {
	const { c } = useTranslation()

	return (
		<div
			className={cx(styles.notificationRow, !mention.seen && styles.unRead)}
			onClick={() => clickCallback?.()}
		>
			<div className='text-muted mb-2'>{formatTimeFromToday(mention.createdAt)}</div>

			{c('notification.row.defaultText')}
		</div>
	)
})
export default NotificationRow
