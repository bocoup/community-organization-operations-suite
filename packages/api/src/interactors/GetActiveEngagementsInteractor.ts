/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EngagementStatus } from '@cbosuite/schema/dist/provider-types'
import { DbEngagement } from '~db'
import { sortByDate } from '~utils'
import { GetEngagementsInteractorBase } from './GetEngagementsInteractorBase'

export class GetActiveEngagementsInteractor extends GetEngagementsInteractorBase {
	protected status = { $nin: [EngagementStatus.Closed, EngagementStatus.Completed] }

	protected sortBy(a: DbEngagement, b: DbEngagement) {
		return sortByDate({ date: a.start_date as string }, { date: b.start_date as string })
	}
}
