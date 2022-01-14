/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { IFieldFilter } from '../../types'

export function useRequestReportFilters(setFieldFilters: (filters: IFieldFilter[]) => void) {
	useEffect(() => {
		setFieldFilters(buildReportFilters())
	}, [setFieldFilters])
}

function buildReportFilters(): IFieldFilter[] {
	const clientFilters = [
		'name',
		'tags',
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
