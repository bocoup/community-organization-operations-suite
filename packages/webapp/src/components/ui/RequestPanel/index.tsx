/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Panel as FluentPanel, PanelType, Spinner } from '@fluentui/react'
import { memo, useState } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import type ComponentProps from '~types/ComponentProps'
import RequestPanelBody from '~ui/RequestPanelBody'
import styles from './index.module.scss'

interface RequestPanelProps extends ComponentProps {
	openPanel?: boolean
	onDismiss?: () => void
	request?: { id: string; orgId: string }
}

const RequestPanel = memo(function RequestPanel({
	children,
	onDismiss,
	openPanel = false,
	request
}: RequestPanelProps): JSX.Element {
	const { c } = useTranslation()
	const [loaded, setIsLoaded] = useState<boolean>(false)

	const isLoaded = (loaded: boolean) => {
		setIsLoaded(loaded)
	}

	if (!request) return null

	return (
		<div>
			<FluentPanel
				isLightDismiss
				isOpen={openPanel}
				type={PanelType.medium}
				closeButtonAriaLabel={c('panelActions.closeAriaLabel')}
				onDismiss={onDismiss}
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
								backgroundColor: 'var(--bs-primary)',
								borderRadius: '50%',
								marginRight: 20,
								width: 26,
								height: 26
							},
							rootHovered: {
								backgroundColor: 'var(--bs-primary-dark)'
							},
							rootPressed: {
								backgroundColor: 'var(--bs-primary-dark)'
							},
							icon: {
								color: 'var(--bs-white)',
								fontWeight: 600
							}
						}
					}
				}}
			>
				<div>
					<div className={`${styles.loadingSpinner} ${loaded ? styles.loaded : null}`}>
						<Spinner
							className='waitSpinner'
							label={c('panelActions.loading')}
							size={3}
							labelPosition='bottom'
						/>
					</div>
					<RequestPanelBody request={request} onClose={onDismiss} isLoaded={isLoaded} />
				</div>
			</FluentPanel>
		</div>
	)
})
export default RequestPanel
