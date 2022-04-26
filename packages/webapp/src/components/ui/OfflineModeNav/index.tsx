/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon, TooltipHost } from '@fluentui/react'
import styles from './index.module.scss'
import { useState, useEffect, memo, useMemo } from 'react'
import cx from 'classnames'
import { Badge } from '~ui/Badge'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { get } from 'lodash'
import { useNavCallback } from '~hooks/useNavCallback'
import { useLocationQuery } from '~hooks/useLocationQuery'
import { isOfflineState } from '~store'
import { useRecoilState } from 'recoil'
import { useOffline } from '~hooks/useOffline'
import { useTranslation } from '~hooks/useTranslation'

export const OfflineModeNav = memo(function OfflineModeNav() {
	const { c } = useTranslation()
	const isOffline = useOffline()

	return (
		// Must use svg for tooltip to display properly when the user goes offline
		<div id='offline-mode-icon' className={cx(styles.offline)}>
			{isOffline && (
				<TooltipHost content={c('mainNavigation.offline')} tooltipProps={{ maxWidth: 150 }}>
					<div className={cx(styles.cloud)}>
						<svg
							width='48'
							height='48'
							viewBox='0 0 48 48'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M13.0448 20C13.5501 14.3935 18.262 10 24 10C29.738 10 34.4499 14.3935 34.9552 20H35.25C39.5302 20 43 23.4698 43 27.75C43 32.0302 39.5302 35.5 35.25 35.5H12.75C8.46979 35.5 5 32.0302 5 27.75C5 23.4698 8.46979 20 12.75 20H13.0448ZM24 12.5C19.3056 12.5 15.5 16.3056 15.5 21V21.25C15.5 21.9404 14.9404 22.5 14.25 22.5H12.75C9.85051 22.5 7.5 24.8505 7.5 27.75C7.5 30.6495 9.8505 33 12.75 33H35.25C38.1495 33 40.5 30.6495 40.5 27.75C40.5 24.8505 38.1495 22.5 35.25 22.5H33.75C33.0596 22.5 32.5 21.9404 32.5 21.25V21C32.5 16.3056 28.6944 12.5 24 12.5Z'
								fill='#212121'
							/>
						</svg>
					</div>
					<div className={cx(styles.line)}>
						<svg
							width='48'
							height='48'
							viewBox='0 0 48 48'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M43.6339 4.36612C44.122 4.85427 44.122 5.64573 43.6339 6.13388L6.13388 43.6339C5.64573 44.122 4.85427 44.122 4.36612 43.6339C3.87796 43.1457 3.87796 42.3543 4.36612 41.8661L41.8661 4.36612C42.3543 3.87796 43.1457 3.87796 43.6339 4.36612Z'
								fill='#212121'
							/>
						</svg>
					</div>
				</TooltipHost>
			)}
		</div>
	)
})
