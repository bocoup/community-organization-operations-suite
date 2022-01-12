/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Service } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import { empty } from '~utils/noop'
import { IFieldFilter } from '../../types'

export function useServiceReportFilters(
	service: Service,
	setFieldFilters: (filters: IFieldFilter[]) => void
) {
	useEffect(
		function populateFieldFilters() {
			setFieldFilters(buildServiceFilters(service))
		},
		[service, setFieldFilters]
	)
}

function buildServiceFilters(service: Service): IFieldFilter[] {
	const headerFilters: IFieldFilter[] = service.fields.map((field) => ({
		id: field.id,
		name: field.name,
		type: field.type,
		value: []
	}))

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

	return [...headerFilters, ...contactFilters]
}
