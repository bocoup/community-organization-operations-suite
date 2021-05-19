/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DbItemListResponse, DbItemResponse } from './types'
import { Configuration } from '~components/Configuration'

export abstract class CollectionBase<T> {
	#config: Configuration

	constructor(config: Configuration) {
		this.#config = config
	}

	public itemById(id: string): DbItemResponse<T> {
		return {
			item: null,
		}
	}

	public items(offset: number, limit: number): DbItemListResponse<T> {
		return {
			items: [],
			more: false,
		}
	}
}
