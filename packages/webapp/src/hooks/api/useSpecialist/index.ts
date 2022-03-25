/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UserInput, User } from '@cbosuite/schema/dist/client-types'
import { useOrganization } from '../useOrganization'
import type { ApiResponse, MessageResponse } from '../types'
import { useTranslation } from '~hooks/useTranslation'
import { createLogger } from '~utils/createLogger'
import type { DeleteSpecialistCallback } from './useDeleteSpecialistCallback'
import { useDeleteSpecialistCallback } from './useDeleteSpecialistCallback'
import type { UpdateSpecialistCallback } from './useUpdateSpecialistCallback'
import { useUpdateSpecialistCallback } from './useUpdateSpecialistCallback'
import { useCreateSpecialistCallback } from './useCreateSpecialistCallback'
import { useSpecialistList } from './useSpecialistList'
import { useEffect, useMemo } from 'react'
const logger = createLogger('useSpecialist')

interface useSpecialistReturn extends ApiResponse<User[]> {
	createSpecialist: (user: UserInput) => Promise<MessageResponse>
	updateSpecialist: UpdateSpecialistCallback
	deleteSpecialist: DeleteSpecialistCallback
	specialistList: User[]
}

export function useSpecialist(): useSpecialistReturn {
	const { c } = useTranslation()
	const { loading, error } = useOrganization()
	useEffect(() => {
		if (error) {
			logger(c('hooks.useSpecialist.loadData.failed'), error)
		}
	}, [error, c])

	const specialistList = useSpecialistList()
	const createSpecialist = useCreateSpecialistCallback()
	const updateSpecialist = useUpdateSpecialistCallback()
	const deleteSpecialist = useDeleteSpecialistCallback()

	return useMemo(
		() => ({
			loading,
			error,
			createSpecialist,
			updateSpecialist,
			deleteSpecialist,
			specialistList
		}),
		[loading, error, createSpecialist, updateSpecialist, deleteSpecialist, specialistList]
	)
}
