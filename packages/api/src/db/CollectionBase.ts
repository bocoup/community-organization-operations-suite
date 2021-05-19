/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import DataLoader from 'dataloader'
import type { DbItemListResponse, DbItemResponse } from './types'
import type { Collection } from 'mongodb'
import type { Configuration } from '~components/Configuration'

export abstract class CollectionBase<Key, Item> {
	#config: Configuration
	#loader: DataLoader<Key, Item>
	#collection: Collection

	constructor(config: Configuration, collection: Collection) {
		this.#config = config
		this.#collection = collection
		this.#loader = new DataLoader((keys) => this._batchGet(keys))
	}

	public async itemById(id: Key): Promise<DbItemResponse<Item>> {
		const item = await this.#loader.load(id)
		return { item }
	}

	public async items(
		offset: number,
		limit: number
	): Promise<DbItemListResponse<Item>> {
		return {
			items: [],
			more: false,
		}
	}

	private async _batchGet(keys: readonly Key[]): Promise<Item[]> {
		return []
	}
}
