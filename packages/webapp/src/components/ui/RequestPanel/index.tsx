/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Panel as FluentPanel, PanelType } from '@fluentui/react'
import { memo } from 'react'
import type ComponentProps from '~types/ComponentProps'
import RequestPanelBody from '~ui/RequestPanelBody'

interface RequestPanelProps extends ComponentProps {
	openPanel?: boolean
	onDismiss?: () => void
	request?: { id: string; orgId: string }
}

const RequestPanel = memo(function RequestPanel({
	children,
	onDismiss,
	openPanel = false,
	request
}: RequestPanelProps): JSX.Element {
	if (!request) return null

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
					<RequestPanelBody request={request} onClose={onDismiss} />
				</div>
			</FluentPanel>
		</div>
	)
})
export default RequestPanel
