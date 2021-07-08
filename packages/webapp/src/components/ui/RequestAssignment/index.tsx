/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import type { User } from '@greenlight/schema/lib/client-types'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

interface RequestAssignmentProps extends ComponentProps {
	user?: User
}

const RequestAssignment = memo(function RequestAssignment({
	user
}: RequestAssignmentProps): JSX.Element {
	const { t } = useTranslation('requests')

	return (
		<>
			<span>
				{t('viewRequest.body.assignedTo')}:{' '}
				{user ? (
					<strong className='text-primary'>@{user.userName}</strong>
				) : (
					<strong>{t('viewRequest.body.openStatus')}</strong>
				)}
			</span>
		</>
	)
})
export default RequestAssignment
