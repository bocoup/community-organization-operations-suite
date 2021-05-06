/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import User from '~types/User'

export enum SpecialistStatus {
	Open = 'OPEN',
	Busy = 'BUSY',
	Closed = 'CLOSED'
}

export default interface Specialist extends User {
	status: SpecialistStatus
}
