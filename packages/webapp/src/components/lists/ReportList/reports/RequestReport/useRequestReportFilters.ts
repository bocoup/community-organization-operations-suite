/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useInitializeFilters } from '../../hooks'
import type { IFieldFilter } from '../../types'

function buildReportFilters(): IFieldFilter[] {
	const clientFilters = [
		'firstname',
		'lastname',
		'clientTags',
		'gender',
		'race',
		'ethnicity',
		'dateOfBirth',
		'preferredLanguage',
		'preferredContactMethod',
		'preferredContactTime',
		'street',
		'unit',
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

	const requestFilters = [
		'title',
		'requestTags',
		'description',
		'startDate',
		'endDate',
		'status',
		'specialist'
	].map(
		(filter) =>
			({
				id: filter,
				name: filter,
				fieldType: 'requestField',
				value: []
			} as any)
	)

	return [...clientFilters, ...requestFilters]
}

export function useRequestReportFilters(filters, setFilters: (filters: IFieldFilter[]) => void) {
	useInitializeFilters(filters, setFilters, buildReportFilters)
}
