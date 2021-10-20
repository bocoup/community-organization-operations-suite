/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { UserInput, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { DbRole, UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'
import { FailedResponse, SuccessUserResponse } from '~utils/response'

export class UpdateUserInteractor implements Interactor<UserInput, UserResponse> {
	public constructor(
		private readonly localization: Localization,
		private readonly users: UserCollection
	) {}

	public async execute(user: UserInput): Promise<UserResponse> {
		if (!user.id) {
			return new FailedResponse(this.localization.t('mutation.updateUser.userIdRequired'))
		}

		const result = await this.users.itemById(user.id)

		if (!result.item) {
			return new FailedResponse(this.localization.t('mutation.updateUser.userNotFound'))
		}
		const dbUser = result.item

		if (dbUser.email !== user.email) {
			const emailCheck = await this.users.count({
				email: user.email
			})

			if (emailCheck !== 0) {
				return new FailedResponse(this.localization.t('mutation.updateUser.emailExist'))
			}
		}

		await this.users.updateItem(
			{ id: dbUser.id },
			{
				$set: {
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
						}) || [],
					address: user?.address
						? {
								street: user.address?.street || '',
								unit: user.address?.unit || '',
								city: user.address?.city || '',
								state: user.address?.state || '',
								zip: user.address?.zip || ''
						  }
						: undefined,
					description: user.description || undefined,
					additional_info: user.additionalInfo || undefined
				}
			}
		)

		return new SuccessUserResponse(
			this.localization.t('mutation.updateUser.success'),
			createGQLUser(dbUser, true)
		)
	}
}
