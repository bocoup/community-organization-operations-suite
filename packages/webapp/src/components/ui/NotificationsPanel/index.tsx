/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Panel as FluentPanel, PanelType } from '@fluentui/react'
import { memo } from 'react'
import type ComponentProps from '~types/ComponentProps'
import NotificationPanelBody from '~ui/NotificationPanelBody'

interface NotificationPanelProps extends ComponentProps {
	openPanel?: boolean
	onDismiss?: () => void
}

const NotificationPanel = memo(function NotificationPanel({
	onDismiss,
	openPanel = false
}: NotificationPanelProps): JSX.Element {
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
						marginTop: 58
					},
					overlay: {
						marginTop: 58
					},
					scrollableContent: {
						overflow: 'visible'
					},
					content: {
						overflow: 'visible'
					},
					subComponentStyles: {
						closeButton: {
							root: {
								backgroundColor: '#2f9bed',
								borderRadius: '50%',
								marginRight: 20,
								width: 26,
								height: 26
							},
							rootHovered: {
								backgroundColor: '#2f9bed'
							},
							rootPressed: {
								backgroundColor: '#2f9bed'
							},
							icon: {
								color: 'white',
								fontWeight: 600
							}
						}
					}
				}}
			>
				<div>
					{/* TODO: Add loading state with fade in of content */}
					<NotificationPanelBody onClose={onDismiss} />
				</div>
			</FluentPanel>
		</div>
	)
})
export default NotificationPanel
