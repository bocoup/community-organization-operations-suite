/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import type { User } from '@cbosuite/schema/dist/client-types'
import { memo } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { UsernameTag } from '~ui/UsernameTag'

interface RequestAssignmentProps {
	user?: User
}

export const RequestAssignment: StandardFC<RequestAssignmentProps> = memo(
	function RequestAssignment({ user }) {
		const { t } = useTranslation(Namespace.Requests)
		return (
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
		)
	}
)
