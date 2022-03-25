/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IPanelStyles } from '@fluentui/react'
import { Panel as FluentPanel, PanelType } from '@fluentui/react'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import type { StandardFC } from '~types/StandardFC'
import { NotificationPanelBody } from '~ui/NotificationPanelBody'

interface NotificationPanelProps {
	openPanel?: boolean
	onDismiss?: () => void
}

export const NotificationPanel: StandardFC<NotificationPanelProps> = memo(
	function NotificationPanel({ openPanel, onDismiss }) {
		const { c } = useTranslation()

		return (
			<FluentPanel
				isLightDismiss
				isOpen={openPanel}
				type={PanelType.medium}
				closeButtonAriaLabel={c('panelActions.closeAriaLabel')}
				onDismiss={onDismiss}
				styles={panelStyles}
			>
				<div>
					<NotificationPanelBody />
				</div>
			</FluentPanel>
		)
	}
)

const panelStyles: Partial<IPanelStyles> = {
	main: {
		marginTop: 'var(--action-bar--height)'
	},
	overlay: {
		marginTop: 'var(--action-bar--height)'
	},
	contentInner: {
		marginTop: -44
	},
	content: {
		padding: 24,
		paddingTop: 0
	},
	subComponentStyles: {
		closeButton: {
			root: {
				backgroundColor: 'var(--bs-white)',
				borderRadius: '50%',
				marginRight: 20,
				width: 26,
				height: 26,
				zIndex: 2
			},
			icon: {
				color: 'var(--bs-primary-light)',
				fontWeight: 600
			}
		}
	}
}
