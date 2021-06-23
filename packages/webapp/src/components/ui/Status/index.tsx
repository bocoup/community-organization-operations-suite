/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import StatusIndicator from '../StatusIndicator'
import type ComponentProps from '~types/ComponentProps'
import { SpecialistStatus } from '~types/Specialist'
import { memo } from 'react'

interface StatusProps extends ComponentProps {
	status: SpecialistStatus
}

/**
 *
 * TODO: get copy from localization
 * @param status {SpecialistStatus}
 * @returns {string} bootstrap class of status indicator
 */
const getStatusMessage = (status: SpecialistStatus): string => {
	switch (status) {
		case SpecialistStatus.Open:
			return 'Open to more work'
		case SpecialistStatus.Busy:
			return 'Busy but available'
		case SpecialistStatus.Closed:
			return 'Closed to new work'
	}
}

const StatusComponent = memo(function StatusComponent({ status }: StatusProps): JSX.Element {
	return (
		<div className='d-flex align-items-center'>
			<StatusIndicator status={status} /> {getStatusMessage(status)}
		</div>
	)
})
export default StatusComponent
