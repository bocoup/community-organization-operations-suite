/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import BoldLinkButton from '~components/ui/BoldLinkButton'
import RequestActionHistoryItem from '~components/ui/RequestActionHistoryItem'
import type ComponentProps from '~types/ComponentProps'
import type { Action } from '@cbosuite/schema/dist/client-types'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

interface RequestActionHistoryProps extends ComponentProps {
	title?: string
	requestActions?: Action[]
}

const RequestActionHistory = memo(function RequestActionHistory({
	className,
	requestActions
}: RequestActionHistoryProps): JSX.Element {
	const { t } = useTranslation('requests')
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
})
export default RequestActionHistory
