/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Requester from 'types/Requester'
import Specialist from 'types/Specialist'

export enum Action {
	Reminder = 'REMINDER',
	CheckIn = 'CHECK_IN',
	Comment = 'COMMENT',
	Assignment = 'ASSIGNMENT',
	Claimed = 'CLAIMED'
}

export default interface RequestAction {
	id: string | number
	createdAt: string
	action: Action
	message: string
	requester: Requester
	specialist: Specialist
}
