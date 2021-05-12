/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import BoldLinkButton from '~components/ui/BoldLinkButton'
import RequestActionHistoryItem from '~components/ui/RequestActionHistoryItem'
import type ComponentProps from '~types/ComponentProps'
import RequestAction, { Action } from '~types/RequestAction'
import { SpecialistStatus } from '~types/Specialist'

// TODO: make Request Action History dynamic
const d = new Date()
const d2 = new Date()
d2.setDate(d2.getDate() - 1)

const fakeRequestActionHistory: RequestAction[] = [
	{
		id: 1,
		action: Action.CheckIn,
		message: 'I’ll be driving to pick up her medication tomorrow at 3:00 PM.',
		createdAt: d.getTime().toString(),
		specialist: {
			userName: 'Miguel',
			firstName: 'Miguel',
			lastName: 'Malkovich',
			id: 'miguel',
			fullName: 'Miguel Malkovich',
			status: SpecialistStatus.Open
		},
		requester: {
			firstName: 'Miguel',
			lastName: 'Malkovich',
			id: 'miguel',
			fullName: 'Miguel Malkovich'
		}
	},
	{
		id: 2,
		action: Action.Claimed,
		message: 'I’ll be driving to pick up her medication tomorrow at 3:00 PM.',
		createdAt: d2.getTime().toString(),
		specialist: {
			userName: 'Miguel',
			firstName: 'Miguel',
			lastName: 'Malkovich',
			id: 'Miguel',
			fullName: 'Miguel Malkovich',
			status: SpecialistStatus.Open
		},
		requester: {
			firstName: 'Jack',
			lastName: 'Jackson',
			id: 'jack',
			fullName: 'Jack Jackson'
		}
	}
]

interface RequestActionHistoryProps extends ComponentProps {
	title?: string
}

export default function RequestActionHistory({
	className
}: RequestActionHistoryProps): JSX.Element {
	return (
		<div className={className}>
			<div className='mb-3'>
				{fakeRequestActionHistory.map((requestAction, i) => {
					return <RequestActionHistoryItem requestAction={requestAction} key={requestAction.id} />
				})}
			</div>
			<BoldLinkButton type='submit' icon='Add' text='See more' />
		</div>
	)
}
