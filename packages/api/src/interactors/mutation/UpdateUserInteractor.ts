/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateUserArgs, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError, ForbiddenError } from 'apollo-server-errors'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { empty, emptyStr } from '~utils/noop'
import { SuccessUserResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { UserCollection } from '~db/UserCollection'
import { Telemetry } from '~components/Telemetry'
import { DbRole, DbUser } from '~db/types'
import { createAuditLog } from '~utils/audit'

@singleton()
export class UpdateUserInteractor
	implements Interactor<unknown, MutationUpdateUserArgs, UserResponse>
{
	public constructor(
		private localization: Localization,
		private users: UserCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
		{ user }: MutationUpdateUserArgs,
		{ locale, identity }: RequestContext
	): Promise<UserResponse> {
		if (!identity?.id) throw new ForbiddenError('not authenticated')
		if (!user.id) {
			throw new UserInputError(this.localization.t('mutation.updateUser.userIdRequired', locale))
		}

		const result = await this.users.itemById(user.id)

		if (!result.item) {
			throw new UserInputError(this.localization.t('mutation.updateUser.userNotFound', locale))
		}
		const dbUser = result.item

		if (dbUser.email !== user.email) {
			const emailCheck = await this.users.count({
				email: user.email
			})

			if (emailCheck !== 0) {
				throw new UserInputError(this.localization.t('mutation.updateUser.emailExist', locale))
			}
		}

		const [audit_log, update_date] = createAuditLog('update user', identity.id)
		const update: Partial<DbUser> = {
			first_name: user.first,
			middle_name: user.middle || undefined,
			last_name: user.last,
			user_name: user.userName,
			email: user.email,
			phone: user.phone || undefined,
			roles:
				user?.roles?.map((r) => {
					return {
						org_id: r.orgId,
						role_type: r.roleType
					} as DbRole
				}) || empty,
			address: user?.address
				? {
						street: user.address?.street || emptyStr,
						unit: user.address?.unit || emptyStr,
						city: user.address?.city || emptyStr,
						state: user.address?.state || emptyStr,
						zip: user.address?.zip || emptyStr
				  }
				: undefined,
			description: user.description || undefined,
			additional_info: user.additionalInfo || undefined,
			update_date
		}

		await this.users.updateItem({ id: dbUser.id }, { $set: update, $push: { audit_log } })

		this.telemetry.trackEvent('UpdateUser')
		return new SuccessUserResponse(
			this.localization.t('mutation.updateUser.success', locale),
			createGQLUser({ ...dbUser, ...update }, true)
		)
	}
}
