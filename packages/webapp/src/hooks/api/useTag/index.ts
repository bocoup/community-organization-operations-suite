/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CreateTagCallback, useCreateTagCallback } from './useCreateTagCallback'
import { UpdateTagCallback, useUpdateTagCallback } from './useUpdateTagCallback'
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
