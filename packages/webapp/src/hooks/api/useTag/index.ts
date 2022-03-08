/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CreateTagCallback } from './useCreateTagCallback'
import { useCreateTagCallback } from './useCreateTagCallback'
import type { UpdateTagCallback } from './useUpdateTagCallback'
import { useUpdateTagCallback } from './useUpdateTagCallback'
import { useMemo } from 'react'

export function useTag(): {
	createTag: CreateTagCallback
	updateTag: UpdateTagCallback
} {
	const createTag = useCreateTagCallback()
	const updateTag = useUpdateTagCallback()

	return useMemo(
		() => ({
			createTag,
			updateTag
		}),
		[createTag, updateTag]
	)
}
