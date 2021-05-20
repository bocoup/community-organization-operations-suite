/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Panel as FluentPanel, PanelType } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import IconButton from '~ui/IconButton'
import { useEffect } from 'react'

interface RequestPanelProps extends ComponentProps {
	openPanel?: boolean
	onDismiss?: () => void
}

export default function RequestPanel({
	children,
	onDismiss,
	openPanel = false
}: RequestPanelProps): JSX.Element {
	const [isOpen, { setTrue: openFluentPanel, setFalse: dismissPanel }] = useBoolean(false)

	useEffect(() => {
		openPanel ? openFluentPanel() : dismissPanel()
	}, [openPanel])

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
				<div className={styles.body}>{children}</div>
			</FluentPanel>
		</div>
	)
}
