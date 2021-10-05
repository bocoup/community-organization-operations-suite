/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Panel as FluentPanel, PanelType } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import cx from 'classnames'
import { memo, useEffect } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { useTranslation } from '~hooks/useTranslation'
import { SpecialistPanelBody } from '~ui/SpecialistPanelBody'

interface SpecialistPanelProps {
	openPanel?: boolean
	onDismiss?: () => void
	specialistId: string
}

export const SpecialistPanel: StandardFC<SpecialistPanelProps> = memo(function SpecialistPanel({
	onDismiss,
	specialistId,
	openPanel = false
}) {
	const [isOpen, { setTrue: openFluentPanel, setFalse: dismissPanel }] = useBoolean(false)
	const { c } = useTranslation()

	useEffect(() => {
		openPanel ? openFluentPanel() : dismissPanel()
	}, [dismissPanel, openFluentPanel, openPanel])

	return (
		<div className={cx(styles.wrapper)}>
			<FluentPanel
				isLightDismiss
				isOpen={isOpen}
				type={PanelType.medium}
				closeButtonAriaLabel={c('panelActions.closeAriaLabel')}
				onDismiss={() => {
					onDismiss?.()
					dismissPanel()
				}}
				styles={{
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
						padding: 0
					},
					subComponentStyles: {
						closeButton: {
							root: {
								backgroundColor: 'var(--bs-white)',
								borderRadius: '50%',
								marginRight: 20,
								width: 26,
								height: 26
							},
							icon: {
								color: 'var(--bs-primary-light)',
								fontWeight: 600
							}
						}
					}
				}}
			>
				<div className={styles.body}>
					<SpecialistPanelBody specialistId={specialistId} />
				</div>
			</FluentPanel>
		</div>
	)
})
