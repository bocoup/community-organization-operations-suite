/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Engagement } from '@cbosuite/schema/dist/client-types'
import type { FC } from 'react'
import { memo } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { UsernameTag } from '~ui/UsernameTag'

export const EngagementStatusColumnItem: FC<{ engagement: Engagement }> = memo(
	function EngagementStatusColumnItem({ engagement }) {
		const { t } = useTranslation(Namespace.Requests)
		if (engagement.user) {
			return (
				<div>
					{t('requestStatus.assigned')}:{' '}
					<UsernameTag
						userId={engagement.user.id}
						userName={engagement.user.userName}
						identifier='specialist'
					/>
				</div>
			)
		} else {
			return t('requestStatus.notStarted')
		}
	}
)
