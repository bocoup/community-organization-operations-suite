/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import style from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { SpecialistStatus } from '~types/Specialist'
import { memo } from 'react'

interface StatusIndicatorProps extends ComponentProps {
	status: SpecialistStatus
}

/**
 *
 * @param status {SpecialistStatus}
 * @returns {string} bootstrap class of status indicator
 */
const getClassIndicatorClass = (status: SpecialistStatus): string => {
	switch (status) {
		case SpecialistStatus.Open:
			return 'bg-success'
		case SpecialistStatus.Busy:
			return 'bg-warning'
		case SpecialistStatus.Closed:
			return 'bg-danger'
	}
}

const StatusIndicator = memo(function StatusIndicator({
	status
}: StatusIndicatorProps): JSX.Element {
	const indicatorClassName = getClassIndicatorClass(status)
	return <div className={cx(style.statusIndicator, indicatorClassName, 'me-2')} />
})
export default StatusIndicator
