/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { Link } from '@fluentui/react'
import cx from 'classnames'
import { memo } from 'react'
import { isEmpty } from 'lodash'
import styles from './index.module.scss'
import { useWindowSize } from '~hooks/useWindowSize'
import type { StandardFC } from '~types/StandardFC'
import { ContainerRowColumn as CRC } from '~ui/CRC'
import { PersonalNav } from '~ui/PersonalNav'
import { TopNav } from '~ui/TopNav'
import { Notifications } from '~ui/Notifications'
import { OfflineModeNav } from '~ui/OfflineModeNav'
import { HelpMenu } from '../HelpMenu'
import { useTranslation } from '~hooks/useTranslation'
import { useEngagementList } from '~hooks/api/useEngagementList'
import { createLogger } from '~utils/createLogger'
import {
	getPreQueueRequest,
	clearPreQueueRequest,
	getPreQueueLoadRequired,
	clearPreQueueLoadRequired
} from '~utils/localCrypto'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { config } from '~utils/config'
import { isInitialized } from '../../../api/cache'

export interface ActionBarProps {
	title: string
}

/**
 * Top Level action bar
 */
export const ActionBar: StandardFC<ActionBarProps> = memo(function ActionBar({ title }) {
	const { isMD } = useWindowSize()
	const { c } = useTranslation()
	const isDurableCacheEnabled = Boolean(config.features.durableCache.enabled)
	const { userId, orgId } = useCurrentUser()
	const { addEngagement } = useEngagementList(orgId, userId)
	const apolloClient = useApolloClient()
	const logger = createLogger('pre-cache')

	const showEnvironmentInfo = 'show-environment-info'
	function hideEnvironmentInfo(event: React.MouseEvent<HTMLElement>) {
		// We are only interested on the header
		const header = (event?.target as HTMLElement)?.closest('header')
		if (header && header.classList.contains(showEnvironmentInfo)) {
			// If the click was below the header, it was on the pseudo-element
			if (event.pageY > header.offsetHeight) {
				header.classList.remove(showEnvironmentInfo)
			}
		}
	}

	useEffect(() => {
		if (isInitialized && isDurableCacheEnabled && getPreQueueLoadRequired()) {
			// TODO: Shouldn't need this timeout
			// cache should be ready to receive but something prevents interface from showing this data.
			// possibly related to durable cache loading (overwriting)

			setTimeout(() => {
				logger('SENDING Pre-queue data to apollo')
				getPreQueueRequest().map((item) => addEngagement(item))
				clearPreQueueLoadRequired()
				clearPreQueueRequest()
			}, 500)
		}
	}, [isInitialized(), isDurableCacheEnabled, getPreQueueLoadRequired()])

	return (
		<header className={cx(styles.actionBar, showEnvironmentInfo)} onClick={hideEnvironmentInfo}>
			<CRC>
				<div className='d-flex justify-content-between align-items-center'>
					<div className='d-flex align-items-center'>
						<Link href='/' className={styles.actionBarTitle}>
							{isEmpty(title) ? c('app.title') : title}
						</Link>
						{isMD && <TopNav />}
					</div>
					<div className='d-flex justify-content-between align-items-center'>
						<OfflineModeNav />
						<Notifications />
						<HelpMenu />
						<PersonalNav />
					</div>
				</div>
			</CRC>
		</header>
	)
})
