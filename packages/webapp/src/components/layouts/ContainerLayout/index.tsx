/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import DefaultLayout from '~layouts/Default'
import ActionBar from '~ui/ActionBar'
import CRC from '~ui/CRC'
import { memo, FC } from 'react'
import { useAuthUser } from '~hooks/api/useAuth'
import SubscribeToMentions from '~ui/SubscribeToMentions'
import ClientOnly from '~ui/ClientOnly'
import styles from './index.module.scss'
import { useOrganization } from '~hooks/api/useOrganization'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import { FlyoutPanels } from '~components/ui/FlyoutPanels'

export interface ContainerLayoutProps {
	size?: 'sm' | 'md' | 'lg'
	showTitle?: boolean
}

const ContainerLayout: FC<ContainerLayoutProps> = memo(function ContainerLayout({
	children,
	size
}): JSX.Element {
	const { accessToken } = useAuthUser()
	const { orgId } = useCurrentUser()
	const { organization } = useOrganization(orgId)
	return (
		<>
			<DefaultLayout>
				<ClientOnly className={styles.actionBar}>
					<ActionBar showNav showTitle title={organization?.name} showPersona showNotifications />
				</ClientOnly>
				<FlyoutPanels />
				<CRC size={size} className={styles.content}>
					<>
						{accessToken && (
							<ClientOnly>
								<SubscribeToMentions />
							</ClientOnly>
						)}
						{accessToken && children}
					</>
				</CRC>
			</DefaultLayout>
		</>
	)
})
export default wrap(ContainerLayout)
