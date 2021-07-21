/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
import { Delegate } from '@resolve/schema/lib/client-types'
import { ApiResponse } from './types'
import { delegateListState } from '~store'
import { useRecoilState } from 'recoil'

export const GET_DELEGATES = gql`
	query delegates($body: ContactIdInput!) {
		delegates(body: $body) {
			oid
			id
			name {
				first
				middle
				last
			}
			email
			organizations {
				id
				name
				description
			}
		}
	}
`

interface useDelegatesReturn extends ApiResponse<Delegate> {
	delegates: Delegate[] | null
	loadDelegates: (id: string) => void
}

export function useDelegates(): useDelegatesReturn {
	const [delegates, setDelegates] = useRecoilState<Delegate[]>(delegateListState)

	const [load, { loading, error }] = useLazyQuery(GET_DELEGATES, {
		fetchPolicy: 'cache-and-network',
		onCompleted: data => {
			if (data?.delegates) {
				setDelegates(data.delegates)
			}
		},
		onError: error => {
			console.error('Load data failed', error)
		}
	})

	const loadDelegates: useDelegatesReturn['loadDelegates'] = id => {
		load({ variables: { body: { contactId: id } } })
	}

	return {
		loading,
		error,
		delegates,
		loadDelegates
	}
}
