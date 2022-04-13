/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useInitializeFilters } from '../../hooks'
import type { IFieldFilter } from '../../types'

export function useClientReportFilters(
	filters: IFieldFilter[],
	setFilters: (filters: IFieldFilter[]) => void
) {
	useInitializeFilters(filters, setFilters, buildClientFilters)
}

function buildClientFilters(): IFieldFilter[] {
	return [
		'firstname',
		'lastname',
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
		'tags',
		'notes'
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
