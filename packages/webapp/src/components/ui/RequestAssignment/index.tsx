/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import type { User } from '@resolve/schema/lib/client-types'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import UsernameTag from '~ui/UsernameTag'

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
					<strong>
						<UsernameTag userId={user.id} userName={user.userName} identifier='specialist' />
					</strong>
				) : (
					<strong>{t('viewRequest.body.openStatus')}</strong>
				)}
			</span>
		</>
	)
})
export default RequestAssignment
