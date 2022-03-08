/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useEffect, useRef } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { Icon } from '@fluentui/react'
import { Overlay } from 'react-bootstrap'
import type { OptionType } from '../ReactSelect'
import { ReactSelect } from '../ReactSelect'
import { TagBadge } from '~ui/TagBadge'
import { useServiceList } from '~hooks/api/useServiceList'
import styles from './index.module.scss'

export interface ServiceSelectProps {
	options?: any[]
	defaultValue?: any
	onChange?: (filterOption: OptionType) => void
}

export const ServiceSelect: StandardFC<ServiceSelectProps> = memo(function ServiceSelect({
	options,
	defaultValue,
	onChange
}) {
	const [selectedService, setSelectedService] = useState(null)
	const [showOverlay, setShowOverlay] = useState(false)
	const overlayTrigger = useRef(null)
	const { serviceList } = useServiceList()

	useEffect(() => {
		if (defaultValue && serviceList.length > 0) {
			setSelectedService(serviceList.find((service) => service.id === defaultValue?.value))
		}
	}, [defaultValue, serviceList])

	return (
		<div className={styles.root}>
			<div className={styles.col}>
				<ReactSelect
					options={options}
					defaultValue={defaultValue}
					onChange={(value) => {
						setSelectedService(serviceList.find((service) => service.id === value?.value?.id))
						onChange(value)
					}}
				/>
			</div>
			{selectedService && (
				<div className={styles.col}>
					<span
						ref={overlayTrigger}
						className={styles.overlayTrigger}
						onMouseEnter={() => setShowOverlay(true)}
						onMouseLeave={() => setShowOverlay(false)}
					>
						<Icon className={styles.overlayTriggerIcon} iconName={'Info'} />
					</span>
					<Overlay target={overlayTrigger.current} show={showOverlay} placement='bottom'>
						{({ placement, arrowProps, show: _show, popper, ...props }) => (
							<div {...props}>
								<div className={styles.overlayInner}>
									<div className={styles.overlayDescription}>
										{selectedService.description || 'No description provided...'}
									</div>
									{selectedService.tags.length > 0 && (
										<div className={styles.overlayTags}>
											<b className={styles.overlayTagsLabel}>Tags:</b>
											{selectedService.tags.map((tag) => (
												<TagBadge key={tag.id} tag={tag} />
											))}
										</div>
									)}
								</div>
							</div>
						)}
					</Overlay>
				</div>
			)}
		</div>
	)
})
