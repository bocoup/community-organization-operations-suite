/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Panel as FluentPanel, PanelType } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import cx from 'classnames'
import { memo, useEffect } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { useTranslation } from '~hooks/useTranslation'
import SpecialistPanelBody from '~ui/SpecialistPanelBody'
interface SpecialistPanelProps extends ComponentProps {
	openPanel?: boolean
	onDismiss?: () => void
	specialistId: string
}

const SpecialistPanel = memo(function SpecialistPanel({
	children,
	onDismiss,
	specialistId,
	openPanel = false
}: SpecialistPanelProps): JSX.Element {
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
				closeButtonAriaLabel={c('panelActions.close.ariaLabel')}
				onDismiss={() => {
					onDismiss?.()
					dismissPanel()
				}}
				styles={{
					main: {
						marginTop: 59
					},
					overlay: {
						marginTop: 59
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
					<SpecialistPanelBody specialistId={specialistId} />
				</div>
			</FluentPanel>
		</div>
	)
})
export default SpecialistPanel
