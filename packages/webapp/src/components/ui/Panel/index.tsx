/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { useBoolean } from '@fluentui/react-hooks'
import { Panel as FluentPanel, PanelType } from '@fluentui/react'
import cx from 'classnames'
import IconButton from '~ui/IconButton'
import { isEmpty } from 'lodash'

interface PanelProps extends ComponentProps {
	onDismiss?: () => void
	buttonOptions?: {
		label: string
		icon: string
	}
}

export default function Panel({ children, buttonOptions, onDismiss }: PanelProps): JSX.Element {
	const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false)

	return (
		<div className={cx(styles.wrapper)}>
			{buttonOptions && !isEmpty(buttonOptions) && (
				<IconButton
					icon={buttonOptions.icon}
					onClick={() => openPanel()}
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
