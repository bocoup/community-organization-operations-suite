/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { singleton } from 'tsyringe'
import { OrgAuthEvaluationStrategy } from '~types'
import { OrgIdArgumentStrategy } from './orgAuthStrategies/OrgIdArgumentStrategy'
import { OrganizationSourceStrategy } from './orgAuthStrategies/OrganizationSourceStrategy'
import { EntityIdToOrgIdStrategy } from './orgAuthStrategies/EntityIdToOrgIdStrategy'
import { InputEntityToOrgIdStrategy } from './orgAuthStrategies/InputEntityToOrgIdStrategy'
import { InputServiceAnswerEntityToOrgIdStrategy } from './orgAuthStrategies/InputServiceAnswerEntityToOrgIdStrategy'
import { UserWithinOrgStrategy } from './orgAuthStrategies/UserWithinOrgStrategy'

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
