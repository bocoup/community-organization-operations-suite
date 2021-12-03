/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SubscriptionMentionsArgs } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { Publisher } from '~components/Publisher'
import { Interactor } from '~types'

@singleton()
export class SubscribeToMentionsInteractor
	implements Interactor<unknown, SubscriptionMentionsArgs, AsyncIterator<unknown, any, undefined>>
{
	public constructor(private publisher: Publisher) {}

	public async execute(
		_: unknown,
		{ userId }: SubscriptionMentionsArgs
	): Promise<AsyncIterator<unknown, any, undefined>> {
		return this.publisher.subscribeToMentions(userId)
	}
}
