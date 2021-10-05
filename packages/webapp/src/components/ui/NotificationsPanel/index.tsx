/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IPanelStyles, Panel as FluentPanel, PanelType } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { useTranslation } from '~hooks/useTranslation'
import { isNotificationsPanelOpenState } from '~store'
import type { StandardFC } from '~types/StandardFC'
import { NotificationPanelBody } from '~ui/NotificationPanelBody'

export const NotificationPanel: StandardFC = memo(function NotificationPanel() {
	const { c } = useTranslation()
	const [isOpen, setOpen] = useRecoilState(isNotificationsPanelOpenState)
	const closePanel = useCallback(() => setOpen(false), [setOpen])

	return (
		<FluentPanel
			isLightDismiss
			isOpen={isOpen}
			type={PanelType.medium}
			closeButtonAriaLabel={c('panelActions.closeAriaLabel')}
			onDismiss={closePanel}
			styles={panelStyles}
		>
			<div>
				<NotificationPanelBody />
			</div>
		</FluentPanel>
	)
})

const panelStyles: Partial<IPanelStyles> = {
	main: {
		marginTop: 58
	},
	overlay: {
		marginTop: 58
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
