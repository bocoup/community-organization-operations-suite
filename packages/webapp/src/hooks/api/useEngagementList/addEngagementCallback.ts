/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { useToasts } from '~hooks/useToasts'
import { EngagementInput, MutationCreateEngagementArgs } from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useCallback } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '../useCurrentUser'

const CREATE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation createEngagement($engagement: EngagementInput!) {
		createEngagement(engagement: $engagement) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export type AddEngagementCallback = (e: EngagementInput) => Promise<void>

export function useAddEngagementCallback(): AddEngagementCallback {
	const { c } = useTranslation(Namespace.Common)
	const { success, failure } = useToasts()
	const { orgId } = useCurrentUser()
	const [createEngagement] = useMutation<any, MutationCreateEngagementArgs>(CREATE_ENGAGEMENT)

	return useCallback(
		async (engagementInput: EngagementInput) => {
			const engagement = { ...engagementInput, orgId }
			try {
				if (engagement.duration) {
					if (engagement['durationUnit']?.length) {
						if ('day' === engagement['durationUnit']) {
							engagement.duration = engagement['durationUnit'] * 24
						} else if ('week' === engagement['durationUnit']) {
							engagement.duration = engagement.duration * 168
						}

						delete engagement['durationUnit']
					}

					engagement.duration = engagement.duration.toString()
				}

				// execute mutator
				await createEngagement({
					variables: { engagement }
				})

				success(c('hooks.useEngagementList.addEngagement.success'))
			} catch (error) {
				failure(c('hooks.useEngagementList.addEngagement.failed'), error)
			}
		},
		[orgId, success, failure, c, createEngagement]
	)
}
