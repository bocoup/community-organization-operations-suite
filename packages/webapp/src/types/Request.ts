/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import Requester from './Requester'
import Specialist from './Specialist'
import Tag from './Tag'

export enum RequestStatus {
	NotStarted = 'NOT_STARTED',
	Started = 'STARTED',
	Pending = 'PENDING',
	Complete = 'COMPLETE',
	Open = 'OPEN',
	Closed = 'CLOSED'
}

export default interface RequestType {
	requester: Requester
	tags: Tag[]
	request: string
	timeRemaining: string
	status: RequestStatus
	id: number
	specialist?: Specialist
}
