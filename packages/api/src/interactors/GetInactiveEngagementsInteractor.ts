/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EngagementStatus } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { DbEngagement } from '~db'
import { sortByDate } from '~utils'
import { GetEngagementsInteractorBase } from './GetEngagementsInteractorBase'

@singleton()
export class GetInactiveEngagementsInteractor extends GetEngagementsInteractorBase {
	protected status = { $in: [EngagementStatus.Closed, EngagementStatus.Completed] }

	protected sortBy(a: DbEngagement, b: DbEngagement) {
		return sortByDate({ date: a.end_date as string }, { date: b.end_date as string })
	}
}
