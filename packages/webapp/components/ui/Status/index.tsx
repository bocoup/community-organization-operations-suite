/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import Status from '~types/Status'
import StatusIndicator from '../StatusIndicator'

interface StatusProps extends ComponentProps {
	status: Status
}

export default function StatusComponent({ status }: StatusProps): JSX.Element {
	const copy =
		status === 'open'
			? 'Open to more work'
			: status === 'busy'
			? 'Busy but available'
			: 'Closed to new work'

	return (
		<div className='d-flex align-items-center'>
			<StatusIndicator status={status} /> {copy}
		</div>
	)
}
