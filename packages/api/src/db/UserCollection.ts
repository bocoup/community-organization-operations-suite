/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { singleton } from 'tsyringe'
import { DatabaseConnector } from '~components/DatabaseConnector'
import { hashPassword, escapeRegexString } from '~utils'
import { CollectionBase } from './CollectionBase'
import { DbMention, DbUser } from './types'

@singleton()
export class UserCollection extends CollectionBase<DbUser> {
	public constructor(connector: DatabaseConnector) {
		super(connector.usersCollection)
	}

	public findUserWithEmail(email: string) {
		// case insensitive
		return this.item({
			email: new RegExp(['^', escapeRegexString(email), '$'].join(''), 'i')
		})
	}

	public async savePassword(user: DbUser, password: string) {
		const hash = await hashPassword(password)
		const result = await this.updateItem(
			{ id: user.id },
			{ $set: { password: hash }, $unset: { forgot_password_token: '' } }
		)
		return result
	}

	public setPasswordResetTokenForUser(user: DbUser, token: string) {
		this.updateItem({ id: user.id }, { $set: { forgot_password_token: token } })
	}

	public setPreferences(userId: DbUser['id'], preferences: string) {
		this.updateItem({ id: userId }, { $set: { preferences } })
	}

	public clearPasswordResetForUser(user: DbUser) {
		this.updateItem({ id: user.id }, { $unset: { forgot_password_token: '' } })
	}

	public addMention(user: DbUser, mention: DbMention) {
		this.updateItem({ id: user.id }, { $push: { mentions: mention } })
	}

	public setFcmTokenForUser(user: DbUser, fcmToken: string) {
		this.updateItem(
			{ id: user.id },
			{
				$set: {
					fcm_token: fcmToken
				}
			}
		)
	}

	public findUsersWithOrganization(organizationId: string) {
		// TODO: add pagination
		return this.items(
			{},
			{
				'roles.org_id': {
					$eq: organizationId
				}
			}
		)
	}
}
