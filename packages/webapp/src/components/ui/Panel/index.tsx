/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Panel as FluentPanel, PanelType } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import { memo, useEffect } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { IconButton } from '~ui/IconButton'
import { noop } from '~utils/noop'

interface PanelProps {
	openPanel?: boolean
	onDismiss?: () => void
	buttonOptions?: {
		label: string
		icon: string
	}
}

export const Panel: StandardFC<PanelProps> = memo(function Panel({
	children,
	buttonOptions,
	onDismiss = noop,
	openPanel = false
}) {
	const [isOpen, { setTrue: openFluentPanel, setFalse: dismissPanel }] = useBoolean(false)

	useEffect(() => {
		openPanel ? openFluentPanel() : dismissPanel()
	}, [dismissPanel, openFluentPanel, openPanel])

	return (
		<div className={cx(styles.wrapper)}>
			{buttonOptions && !isEmpty(buttonOptions) && (
				<IconButton
					icon={buttonOptions.icon}
					onClick={() => openFluentPanel()}
					text={buttonOptions.label}
				/>
			)}
			<FluentPanel
				isLightDismiss={false}
				isOpen={isOpen}
				type={PanelType.medium}
				closeButtonAriaLabel='Close'
				onDismiss={() => {
					onDismiss()
					dismissPanel()
				}}
				styles={{
					main: {
						marginTop: 58
					},
					overlay: {
						marginTop: 58,
						cursor: 'default'
					},
					scrollableContent: {
						minHeight: '100%'
					},
					content: {
						minHeight: '100%'
					},
					subComponentStyles: {
						closeButton: {
							root: {
								backgroundColor: 'var(--bs-primary-light)',
								borderRadius: '50%',
								marginRight: 20,
								width: 26,
								height: 26
							},
							rootHovered: {
								backgroundColor: 'var(--bs-primary-light)'
							},
							rootPressed: {
								backgroundColor: 'var(--bs-primary-light)'
							},
							icon: {
								color: 'var(--bs-white)',
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
})
