/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type { MutationCreateServiceArgs, ServiceInput } from '@cbosuite/schema/dist/client-types'
import { ServiceFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCallback } from 'react'

const CREATE_SERVICE = gql`
	${ServiceFields}

	mutation createService($service: ServiceInput!) {
		createService(service: $service) {
			message
			service {
				...ServiceFields
			}
		}
	}
`

export type AddServiceCallback = (input: ServiceInput) => Promise<boolean>

export function useAddServiceCallback(load: () => void): AddServiceCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [addService] = useMutation<any, MutationCreateServiceArgs>(CREATE_SERVICE)

	return useCallback(
		async (service: ServiceInput) => {
			try {
				await addService({ variables: { service } })
				load()
				success(c('hooks.useServicelist.createServiceSuccess'))
				return true
			} catch (error) {
				failure(c('hooks.useServicelist.createServiceFailed'))
				return false
			}
		},
		[c, success, failure, load, addService]
	)
}
