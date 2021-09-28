/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import DefaultLayout from '~layouts/Default'
import ActionBar from '~ui/ActionBar'
import CRC from '~ui/CRC'
import { FC, memo } from 'react'
import { useAuthUser } from '~hooks/api/useAuth'
import SubscribeToMentions from '~ui/SubscribeToMentions'
import styles from './index.module.scss'
import { useOrganization } from '~hooks/api/useOrganization'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import { FlyoutPanels } from '~components/ui/FlyoutPanels'

const ContainerLayout: FC = memo(function ContainerLayout({ children }): JSX.Element {
	const { accessToken } = useAuthUser()
	const { orgId } = useCurrentUser()
	const { organization } = useOrganization(orgId)

	return (
		<DefaultLayout>
			<div className={styles.actionBar}>
				<ActionBar showNav showTitle title={organization?.name} showPersona showNotifications />
			</div>
			<FlyoutPanels />
			<CRC className={styles.content}>
				<>
					{accessToken && <SubscribeToMentions />}
					{accessToken && children}
				</>
			</CRC>
		</DefaultLayout>
	)
})
export default wrap(ContainerLayout)
