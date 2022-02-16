/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IPanelStyles, Panel as FluentPanel, PanelType } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useEffect } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { noop } from '~utils/noop'

interface PanelProps {
	onDismiss?: () => void
	openPanel?: boolean
}

export const Panel: StandardFC<PanelProps> = memo(function Panel({
	children,
	onDismiss = noop,
	openPanel = false
}) {
	const [isOpen, { setTrue: openFluentPanel, setFalse: dismissPanel }] = useBoolean(false)

	useEffect(() => {
		openPanel ? openFluentPanel() : dismissPanel()
	}, [dismissPanel, openFluentPanel, openPanel])

	const handleOnDismiss = () => {
		onDismiss()
		dismissPanel()
	}

	return (
		<FluentPanel
			closeButtonAriaLabel='Close'
			isLightDismiss={false}
			isOpen={isOpen}
			onDismiss={handleOnDismiss}
			type={PanelType.medium}
			styles={panelStyles}
		>
			{children}
		</FluentPanel>
	)
})

const panelStyles: Partial<IPanelStyles> = {
	main: {
		marginTop: 'var(--action-bar--height)'
	},
	overlay: {
		marginTop: 'var(--action-bar--height)',
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
}
