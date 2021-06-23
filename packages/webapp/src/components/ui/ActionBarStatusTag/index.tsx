/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type ComponentProps from '~types/ComponentProps'
import { SpecialistStatus } from '~types/Specialist'
import StatusIndicator from '~ui/StatusIndicator'

interface ActionBarStatusTagProps extends ComponentProps {
	status: SpecialistStatus
}
/**
 *
 * @param status {SpecialistStatus}
 * @returns {string} message of status tag
 */
const getStatusMessage = (status: SpecialistStatus): string => {
	switch (status) {
		case SpecialistStatus.Open:
			return 'Available'
		case SpecialistStatus.Busy:
			return 'Busy'
		case SpecialistStatus.Closed:
			return 'Not Available'
	}
}

const ActionBarStatusTag = memo(function ActionBarStatusTag({
	status
}: ActionBarStatusTagProps): JSX.Element {
	const statusMessage = getStatusMessage(status)

	return (
		<div className='d-flex align-items-center'>
			<StatusIndicator status={status} className='me-2' /> {statusMessage}
		</div>
	)
})
export default ActionBarStatusTag
