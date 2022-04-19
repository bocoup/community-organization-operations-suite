/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Service } from '@cbosuite/schema/dist/client-types'
import { empty } from '~utils/noop'
import { useInitializeFilters } from '../../hooks'
import type { IFieldFilter } from '../../types'

export function useServiceReportFilters(
	filters: IFieldFilter[],
	setFilters: (filters: IFieldFilter[]) => void,
	service: Service
) {
	function buildServiceFiltersHelper() {
		return buildServiceFilters(service)
	}

	useInitializeFilters(filters, setFilters, buildServiceFiltersHelper)
}

function buildServiceFilters(service: Service): IFieldFilter[] {
	const serviceFilters: IFieldFilter[] =
		service?.fields?.map((field) => ({
			id: field.id,
			name: field.name,
			type: field.type,
			value: []
		})) ?? []

	const contactFilters: IFieldFilter[] = !service.contactFormEnabled
		? empty
		: [
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
		  ].map((filter) => ({
				id: filter,
				name: filter,
				type: 'clientField',
				value: []
		  }))

	return [...serviceFilters, ...contactFilters]
}
