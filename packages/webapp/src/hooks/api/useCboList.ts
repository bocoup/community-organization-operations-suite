/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql } from '@apollo/client'
import type { ApiResponse } from './types'
import type { Organization } from '@cbosuite/schema/dist/client-types'
import { createLogger } from '~utils/createLogger'
import { empty } from '~utils/noop'
const logger = createLogger('useCboList')

const GET_CBO_LIST = gql`
	query {
		organizations {
			name
		}
	}
`

export function useCboList(): ApiResponse<Organization[]> {
	const { loading, error, data } = useQuery(GET_CBO_LIST)
	if (error) {
		logger('error loading data', error)
	}

	const cboData: Organization[] = !loading && (data?.organizations as Organization[])

	return {
		loading,
		error,
		data: cboData || empty
	}
}
