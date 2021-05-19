/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import DataLoader from 'dataloader'
import type {
	DbIdentified,
	DbItemListResponse,
	DbItemResponse,
	DbPaginationArgs,
} from './types'
import type { Collection, FilterQuery } from 'mongodb'

type Key = string
export abstract class CollectionBase<Item extends DbIdentified> {
	#loader: DataLoader<Key, Item>
	#collection: Collection<Item>

	public constructor(collection: Collection) {
		this.#collection = collection
		this.#loader = new DataLoader((keys) => this._batchGet(keys))
	}

	/**
	 * Finds an item by id
	 * @param id The ID of the item to find
	 * @returns A DbItemResponse
	 */
	public async itemById(id: Key): Promise<DbItemResponse<Item>> {
		const item = await this.#loader.load(id)
		return { item }
	}

	/**
	 * Finds an item
	 * @param filter The filter criteria to apply
	 * @returns A DbitemResponse
	 */
	public async item(filter: FilterQuery<Item>): Promise<DbItemResponse<Item>> {
		const item = await this.#collection.findOne(filter)
		return { item }
	}

	/**
	 * Finds a set of items
	 * @param pagination The pagiantion arguments
	 * @param filter The filter criteria to apply, optional
	 * @returns A DbListItem
	 */
	public async items(
		{ offset, limit }: DbPaginationArgs,
		query?: FilterQuery<Item>
	): Promise<DbItemListResponse<Item>> {
		const result = this.#collection.find(query).skip(offset).limit(limit)
		const [items, totalCount] = await Promise.all([
			result.toArray(),
			this.count(),
		])
		const more = offset + items.length < totalCount
		return { items, more, totalCount }
	}

	/**
	 * Count the number of items matchaing a query
	 * @param query The filter criteria to apply, optional
	 * @returns The number of items matching the criteria
	 */
	public async count(query?: FilterQuery<Item>): Promise<number> {
		return this.#collection.count(query)
	}

	private async _batchGet(keys: readonly Key[]): Promise<Item[]> {
		const idSet = ([...keys] as any[]) as string[]
		const result = await this.#collection
			.find({
				id: { $in: idSet as any[] },
			})
			.toArray()
		return keys.map((k) => result.find((r) => r.id === k) as Item)
	}
}
