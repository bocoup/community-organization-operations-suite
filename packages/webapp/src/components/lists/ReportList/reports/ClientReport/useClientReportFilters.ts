/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useInitializeFilters } from '../../hooks'
import { IFieldFilter } from '../../types'

export function useClientReportFilters(
	filters: IFieldFilter[],
	setFilters: (filters: IFieldFilter[]) => void
) {
	useInitializeFilters(filters, setFilters, buildClientFilters)
}

function buildClientFilters(): IFieldFilter[] {
	return [
		'name',
		'gender',
		'race',
		'ethnicity',
		'preferredLanguage',
		'preferredContactMethod',
		'preferredContactTime',
		'dateOfBirth',
		'street',
		'unit',
		'city',
		'county',
		'state',
		'zip',
		'tags'
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
