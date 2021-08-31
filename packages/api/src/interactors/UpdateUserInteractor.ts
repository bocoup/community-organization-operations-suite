/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StatusType, UserInput, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { DbRole, DbUser, UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'

export class UpdateUserInteractor implements Interactor<UserInput, UserResponse> {
	#localization: Localization
	#users: UserCollection

	public constructor(localization: Localization, users: UserCollection) {
		this.#localization = localization
		this.#users = users
	}

	public async execute(user: UserInput, identity?: DbUser | null): Promise<UserResponse> {
		if (!user.id) {
			return {
				user: null,
				message: this.#localization.t('mutation.updateUser.userIdRequired'),
				status: StatusType.Failed
			}
		}

		const result = await this.#users.itemById(user.id)

		if (!result.item) {
			return {
				user: null,
				message: this.#localization.t('mutation.updateUser.userNotFound'),
				status: StatusType.Failed
			}
		}
		const dbUser = result.item

		if (dbUser.email !== user.email) {
			const emailCheck = await this.#users.count({
				email: user.email
			})

			if (emailCheck !== 0) {
				return {
					user: null,
					message: this.#localization.t('mutation.updateUser.emailExist'),
					status: StatusType.Failed
				}
			}
		}

		await this.#users.updateItem(
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

		return {
			user: createGQLUser(dbUser),
			message: this.#localization.t('mutation.updateUser.success'),
			status: StatusType.Success
		}
	}
}
