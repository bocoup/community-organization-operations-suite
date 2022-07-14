/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { wrap } from '~utils/appinsights'
import { useOffline } from '~hooks/useOffline'
import { useTranslation } from '~hooks/useTranslation'
import styles from './index.module.scss'
import cx from 'classnames'

export const OfflineEntityCreationNotice: FC<{ isEntityCreation?: boolean }> = wrap(
	function OfflineEntityCreationNotice({ isEntityCreation = true }) {
		const isOffline = useOffline()
		const { c } = useTranslation()

		const notice = isEntityCreation ? c('offline.entityCreationNotice') : c('offline.generalNotice')

		return <>{isOffline && <div className={cx(styles.notice)}> {notice} </div>}</>
	}
)
