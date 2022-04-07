/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionBar } from '~ui/ActionBar'
import { ContainerRowColumn as CRC } from '~ui/CRC'
import type { FC } from 'react'
import { SubscribeToMentions } from '~ui/SubscribeToMentions'
import styles from './index.module.scss'
import { useOrganization } from '~hooks/api/useOrganization'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import { FlyoutPanels } from '~components/ui/FlyoutPanels'

export const ContainerLayout: FC = wrap(function ContainerLayout({ children }) {
	const { currentUser } = useCurrentUser()
	const { orgId } = useCurrentUser()
	const { organization } = useOrganization(orgId)

	return (
		<>
			<ActionBar title={organization?.name} />
			<FlyoutPanels />
			<CRC className={styles.content}>
				{currentUser?.id ? (
					<>
						<SubscribeToMentions />
						{children}
					</>
				) : null}
			</CRC>
		</>
	)
})
