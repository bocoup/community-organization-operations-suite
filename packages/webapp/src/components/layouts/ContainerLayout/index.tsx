/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionBar } from '~ui/ActionBar'
import { ContainerRowColumn as CRC } from '~ui/CRC'
import { FC } from 'react'
import { SubscribeToMentions } from '~ui/SubscribeToMentions'
import styles from './index.module.scss'
import { useOrganization } from '~hooks/api/useOrganization'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import { FlyoutPanels } from '~components/ui/FlyoutPanels'
import { useAccessToken } from '~hooks/api/useAccessToken'

export const ContainerLayout: FC = wrap(function ContainerLayout({ children }) {
	const accessToken = useAccessToken()
	const { orgId } = useCurrentUser()
	const { organization } = useOrganization(orgId)

	return (
		<>
			<div className={styles.actionBar}>
				<ActionBar showNav showTitle title={organization?.name} showPersona showNotifications />
			</div>
			<FlyoutPanels />
			<CRC className={styles.content}>
				{accessToken ? (
					<>
						<SubscribeToMentions />
						{children}
					</>
				) : null}
			</CRC>
		</>
	)
})
