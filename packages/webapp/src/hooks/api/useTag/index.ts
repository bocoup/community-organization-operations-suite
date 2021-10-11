/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TagInput } from '@cbosuite/schema/dist/client-types'
import { MessageResponse } from '../types'
import { CreateTagCallback, useCreateTagCallback } from './useCreateTagCallback'
import { useUpdateTagCallback } from './useUpdateTagCallback'
import { useMemo } from 'react'

export function useTag(): {
	createTag: CreateTagCallback
	updateTag: (orgId: string, tag: TagInput) => Promise<MessageResponse>
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
