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

interface PanelProps extends ComponentProps {
	openPanel?: boolean
	onDismiss?: () => void
	buttonOptions?: {
		label: string
		icon: string
	}
}

export default function Panel({
	children,
	buttonOptions,
	onDismiss,
	openPanel = false
}: PanelProps): JSX.Element {
	const [isOpen, { setTrue: openFluentPanel, setFalse: dismissPanel }] = useBoolean(false)

	useEffect(() => {
		openPanel ? openFluentPanel() : dismissPanel()
	}, [openPanel])

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
					}
				}}
			>
				<div className={styles.body}>{children}</div>
			</FluentPanel>
		</div>
	)
}
