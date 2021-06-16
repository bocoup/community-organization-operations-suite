/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type { Contact } from '@greenlight/schema/lib/client-types'
import { ContactFields } from '~hooks/api/fragments'
import { contactListState } from '~store'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'

export const GET_CONTACTS = gql`
	${ContactFields}

	query contacts($offset: Int, $limit: Int) {
		contacts(offset: $offset, limit: $limit) {
			...ContactFields
		}
	}
`

interface useContactReturn extends ApiResponse<Contact[]> {
	//createClient: (user: UserInput) => Promise<{ status: string; message?: string }>
	//updateClient: (user: UserInput) => Promise<{ status: string; message?: string }>
}

export function useContacts(): useContactReturn {
	const { loading, error, data } = useQuery(GET_CONTACTS, {
		variables: { offset: 0, limit: 800 },
		fetchPolicy: 'cache-and-network'
	})
	const [, setContacts] = useRecoilState<Contact[] | null>(contactListState)

	if (error) {
		console.error('error loading data', error)
	}

	const contacts: Contact[] = !loading && (data?.contacts as Contact[])

	useEffect(() => {
		if (data?.contacts) {
			setContacts(data.contacts)
		}
	}, [data, setContacts])

	return {
		loading,
		error,
		data: contacts
	}
}
