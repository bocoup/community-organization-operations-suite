/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { wrap } from '~utils/appinsights'
import { useOffline } from '~hooks/useOffline'
import { useTranslation } from '~hooks/useTranslation'
import styles from './index.module.scss'
import cx from 'classnames'

export const OfflineEntityCreationNotice = wrap(function OfflineEntityCreationNotice() {
	const isOffline = useOffline()
	const { c } = useTranslation()

	return (
		<>
			{isOffline && <div className={cx(styles.notice)}> {c('offline.entityCreationNotice')} </div>}
		</>
	)
})
