/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Panel as FluentPanel, PanelType } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import cx from 'classnames'
import { useEffect } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Engagement } from '@greenlight/schema/lib/client-types'
import RequestPanelBody from '~ui/RequestPanelBody'

interface RequestPanelProps extends ComponentProps {
	openPanel?: boolean
	onDismiss?: () => void
	request?: Engagement
}

export default function RequestPanel({
	children,
	onDismiss,
	openPanel = false,
	request
}: RequestPanelProps): JSX.Element {
	const [isOpen, { setTrue: openFluentPanel, setFalse: dismissPanel }] = useBoolean(false)

	useEffect(() => {
		openPanel ? openFluentPanel() : dismissPanel()
	}, [dismissPanel, openFluentPanel, openPanel])

	if (!request) return null

	return (
		<div className={cx(styles.wrapper)}>
			<FluentPanel
				isLightDismiss
				isOpen={isOpen}
				type={PanelType.medium}
				closeButtonAriaLabel='Close'
				onDismiss={() => {
					onDismiss?.()
					dismissPanel()
				}}
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
				<div className={styles.body}>
					{/* TODO: Add loading state with fade in of content */}
					<RequestPanelBody request={request} onClose={dismissPanel} />
				</div>
			</FluentPanel>
		</div>
	)
}
