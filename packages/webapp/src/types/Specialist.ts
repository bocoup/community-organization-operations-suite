/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Tag from './Tag'
import User from '~types/User'

export enum SpecialistStatus {
	Open = 'OPEN',
	Busy = 'BUSY',
	Closed = 'CLOSED'
}

export default interface Specialist extends User {
	status?: SpecialistStatus
	userName: string
	requests?: {
		assigned?: number
		open?: number
		closed?: number
	}
	tags?: Tag[]
	bio?: string
	trainingAndAchievements?: string
	avatar?: string // TODO: this should be it's own type
}
