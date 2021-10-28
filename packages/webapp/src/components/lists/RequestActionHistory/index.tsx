/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RequestActionHistoryItem } from '~components/ui/RequestActionHistoryItem'
import type { StandardFC } from '~types/StandardFC'
import type { Action } from '@cbosuite/schema/dist/client-types'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'

interface RequestActionHistoryProps {
	title?: string
	requestActions?: Action[]
}

export const RequestActionHistory: StandardFC<RequestActionHistoryProps> = wrap(
	function RequestActionHistory({ className, requestActions }) {
		const { t } = useTranslation(Namespace.Requests)
		if (!requestActions || requestActions.length === 0) return null

		return (
			<div className={className}>
				<h3 className='mb-3 mb-lg-4'>{t('viewRequest.body.timeline.title')}</h3>
				<div className='mb-3'>
					{requestActions.map((requestAction, i) => {
						return (
							<RequestActionHistoryItem
								requestAction={requestAction}
								key={`${requestAction.date}-${i}`}
							/>
						)
					})}
				</div>
			</div>
		)
	}
)
