/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import styles from './index.module.scss'
import { useState, useEffect } from 'react'
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import Badge from '~ui/Badge'
import type { Mention } from '@greenlight/schema/lib/client-types'
import formatTimeFromToday from '~utils/formatTimeFromToday'
import ShortString from '../ShortString'

import { useAuthUser } from '~hooks/api/useAuth'

interface NotificationRowProps extends ComponentProps {
	mention: Mention
	clickCallback?: () => void
}

export default function NotificationRow({
	mention,
	clickCallback
}: NotificationRowProps): JSX.Element {
	return (
		<div className={cx(styles.notificationRow)} onClick={() => clickCallback?.()}>
			<div className='text-muted mb-2'>{formatTimeFromToday(mention.createdAt)}</div>
			<ShortString limit={120} text={'You were mentioned in a request. Click here to view.'} />
		</div>
	)
}
