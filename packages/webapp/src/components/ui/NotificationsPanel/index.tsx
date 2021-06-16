/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Panel as FluentPanel, PanelType } from '@fluentui/react'
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import { Engagement } from '@greenlight/schema/lib/client-types'
import NotificationPanelBody from '~ui/NotificationPanelBody'
import { useAuthUser } from '~hooks/api/useAuth'
import { useEffect } from 'react'

interface NotificationPanelProps extends ComponentProps {
	openPanel?: boolean
	onDismiss?: () => void
	request?: Engagement
}

export default function NotificationPanel({
	children,
	onDismiss,
	openPanel = false,
	request
}: NotificationPanelProps): JSX.Element {
	const { authUser, currentUserId } = useAuthUser()

	useEffect(() => {
		console.log('authUser', authUser)
	}, [authUser])

	return (
		<div>
			<FluentPanel
				isLightDismiss
				isOpen={openPanel}
				type={PanelType.medium}
				closeButtonAriaLabel='Close'
				onDismiss={onDismiss}
				styles={{
					main: {
						marginTop: 56
					},
					overlay: {
						marginTop: 56
					},
					contentInner: {
						marginTop: -44
					},
					content: {
						padding: 0
					},
					subComponentStyles: {
						closeButton: {
							root: {
								backgroundColor: 'white',
								borderRadius: '50%',
								marginRight: 20,
								width: 26,
								height: 26
							},
							icon: {
								color: '#2f9bed',
								fontWeight: 600
							}
						}
					}
				}}
			>
				<div>
					{/* TODO: Add loading state with fade in of content */}
					<NotificationPanelBody request={request} onClose={onDismiss} />
				</div>
			</FluentPanel>
		</div>
	)
}
