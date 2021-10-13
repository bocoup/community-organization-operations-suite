/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Service } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import { IFieldFilter } from '../../types'

export function useServiceReportFilters(
	service: Service,
	setFieldFilters: (filters: IFieldFilter[]) => void
) {
	useEffect(() => {
		setFieldFilters(buildServiceFilters(service))
	}, [service, setFieldFilters])
}

function buildServiceFilters(service: Service): IFieldFilter[] {
	// build header filters
	const headerFilters: IFieldFilter[] = []
	service.customFields.forEach((field) => {
		headerFilters.push({
			id: field.fieldId,
			name: field.fieldName,
			fieldType: field.fieldType,
			value: []
		})
	})

	if (service.contactFormEnabled) {
		const serviceClientFilters = ['name', 'gender', 'race', 'ethnicity']
		serviceClientFilters.forEach((filter) => {
			headerFilters.push({
				id: filter,
				name: filter,
				fieldType: 'clientField',
				value: []
			})
		})
	}

	return headerFilters
}
