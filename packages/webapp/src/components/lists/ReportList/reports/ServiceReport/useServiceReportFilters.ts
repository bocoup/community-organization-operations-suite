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
	const headerFilters: IFieldFilter[] = service.customFields.map((field) => ({
		id: field.fieldId,
		name: field.fieldName,
		fieldType: field.fieldType,
		value: []
	}))

	const contactFilters: IFieldFilter[] = !service.contactFormEnabled
		? empty
		: ['name', 'gender', 'race', 'ethnicity'].map((filter) => ({
				id: filter,
				name: filter,
				fieldType: 'clientField',
				value: []
		  }))

	return [...headerFilters, ...contactFilters]
}
