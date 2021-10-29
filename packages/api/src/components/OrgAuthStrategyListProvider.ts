/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { singleton } from 'tsyringe'
import { OrgAuthEvaluationStrategy } from '~types'
import { OrgIdArgumentStrategy } from './OrgIdArgumentStrategy'
import { OrganizationSourceStrategy } from './OrganizationSourceStrategy'
import { EntityIdToOrgIdStrategy } from './EntityIdToOrgIdStrategy'
import { InputEntityToOrgIdStrategy } from './InputEntityToOrgIdStrategy'
import { InputServiceAnswerEntityToOrgIdStrategy } from './InputServiceAnswerEntityToOrgIdStrategy'
import { UserWithinOrgStrategy } from './UserWithinOrgStrategy'

@singleton()
export class OrgAuthStrategyListProvider {
	public constructor(
		private orgSource: OrganizationSourceStrategy,
		private orgIdArg: OrgIdArgumentStrategy,
		private entityIdToOrgId: EntityIdToOrgIdStrategy,
		private inputEntityToOrgId: InputEntityToOrgIdStrategy,
		private inputServiceAnswerEntityToOrgId: InputServiceAnswerEntityToOrgIdStrategy,
		private UserWithinOrgStrategy: UserWithinOrgStrategy
	) {}

	public get(): OrgAuthEvaluationStrategy[] {
		return [
			this.orgSource,
			this.orgIdArg,
			this.entityIdToOrgId,
			this.inputEntityToOrgId,
			this.inputServiceAnswerEntityToOrgId,
			this.UserWithinOrgStrategy
		]
	}
}
