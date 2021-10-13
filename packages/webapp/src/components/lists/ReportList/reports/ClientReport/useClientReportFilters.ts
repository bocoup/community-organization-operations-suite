/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { IFieldFilter } from '../../types'

export function useClientReportFilters(setFieldFilters: (filters: IFieldFilter[]) => void) {
	useEffect(() => {
		setFieldFilters(buildClientFilters())
	}, [setFieldFilters])
}

function buildClientFilters(): IFieldFilter[] {
	const headerFilters: IFieldFilter[] = []
	const clientFilters = [
		'name',
		'gender',
		'race',
		'ethnicity',
		'dateOfBirth',
		'city',
		'county',
		'state',
		'zip'
	]
	clientFilters.forEach((filter) => {
		headerFilters.push({
			id: filter,
			name: filter,
			fieldType: 'clientField',
			value: []
		})
	})

	return headerFilters
}
