/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import BoldLinkButton from '~components/ui/BoldLinkButton'
import RequestActionHistoryItem from '~components/ui/RequestActionHistoryItem'
import type ComponentProps from '~types/ComponentProps'
import type { Action } from '@greenlight/schema/lib/client-types'
import { memo } from 'react'

interface RequestActionHistoryProps extends ComponentProps {
	title?: string
	requestActions?: Action[]
}

const RequestActionHistory = memo(function RequestActionHistory({
	className,
	requestActions
}: RequestActionHistoryProps): JSX.Element {
	if (!requestActions) return null

	return (
		<div className={className}>
			{/* TODO: get text from localization */}
			<h3 className='mb-3 mb-lg-4'>Request Timeline</h3>
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
			{/* <BoldLinkButton type='submit' icon='Add' text='See more' /> */}
		</div>
	)
})
export default RequestActionHistory
