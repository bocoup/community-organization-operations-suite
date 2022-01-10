/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { IFieldFilter } from '../../types'

export function useRequestReportFilters(setFieldFilters: (filters: IFieldFilter[]) => void) {
	useEffect(() => {
		setFieldFilters(buildClientFilters())
	}, [setFieldFilters])
}

function buildClientFilters(): IFieldFilter[] {
	return [
		'name',
		'gender',
		'race',
		'ethnicity',
		'dateOfBirth',
		'city',
		'county',
		'state',
		'zip'
	].map(
		(filter) =>
			({
				id: filter,
				name: filter,
				fieldType: 'clientField',
				value: []
			} as any)
	)
}
