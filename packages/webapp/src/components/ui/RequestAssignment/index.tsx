/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import type { User } from '@greenlight/schema/lib/client-types'
import { memo } from 'react'

interface RequestAssignmentProps extends ComponentProps {
	user?: User
}

const RequestAssignment = memo(function RequestAssignment({
	user
}: RequestAssignmentProps): JSX.Element {
	return (
		<>
			<span>
				Assigned to:{' '}
				{user ? <strong className='text-primary'>@{user.userName}</strong> : <strong>Open</strong>}
			</span>
		</>
	)
})
export default RequestAssignment
