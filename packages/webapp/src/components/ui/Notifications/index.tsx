/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import styles from './index.module.scss'

import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import Badge from '~ui/Badge'
interface NotificationsProps extends ComponentProps {
	mentions?: any[]
}

export default function Notifications({ mentions }: NotificationsProps): JSX.Element {
	return (
		<div className={cx(styles.notifications)}>
			<Badge count={mentions?.length || 0} />
			<FontIcon className='me-3' iconName='Ringer' />
		</div>
	)
}
