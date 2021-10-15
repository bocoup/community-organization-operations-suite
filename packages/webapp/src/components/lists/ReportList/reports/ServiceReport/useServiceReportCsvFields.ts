/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Contact,
	Service,
	ServiceAnswer,
	ServiceField,
	ServiceFieldType
} from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import { useLocale } from '~hooks/useLocale'
import { useTranslation } from '~hooks/useTranslation'
import { CsvField } from '../../types'

export function useServiceReportCsvFields(
	service: Service,
	setCsvFields: (fields: Array<CsvField>) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string
) {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	const [locale] = useLocale()

	useEffect(() => {
		const customFields = service.fields
		const getColumnItemValue = (answerItem: ServiceAnswer, field: ServiceField): string => {
			let answerValue = ''

			const answers = answerItem.fields.find((a) => a.fieldId === field.id)
			if (answers) {
				const fieldValue = customFields.find((f) => f.id === answers.fieldId).inputs

				if (Array.isArray(answers.values)) {
					answerValue = answers.values
						.map((v) => fieldValue.find((f) => f.id === v).label)
						.join(', ')
				} else {
					switch (field.type) {
						case ServiceFieldType.SingleChoice:
							answerValue = fieldValue.find((f) => f.id === answers.fieldId).label
							break
						case ServiceFieldType.Date:
							answerValue = new Date(answers.values).toLocaleDateString(locale)
							break
						default:
							answerValue = answers.values
					}
				}
			} else {
				answerValue = ''
			}

			return answerValue
		}

		const csvFields = customFields.map((field) => {
			return {
				label: field.name,
				value: (item: ServiceAnswer) => {
					return getColumnItemValue(item, field)
				}
			}
		})

		if (service.contactFormEnabled) {
			csvFields.unshift(
				{
					label: t('clientList.columns.name'),
					value: (item: ServiceAnswer) => {
						return `${item.contacts[0].name.first} ${item.contacts[0].name.last}`
					}
				},
				{
					label: t('demographics.gender.label'),
					value: (item: ServiceAnswer) => getDemographicValue('gender', item.contacts[0])
				},
				{
					label: t('demographics.race.label'),
					value: (item: ServiceAnswer) => getDemographicValue('race', item.contacts[0])
				},
				{
					label: t('demographics.ethnicity.label'),
					value: (item: ServiceAnswer) => getDemographicValue('ethnicity', item.contacts[0])
				}
			)
		}
		setCsvFields(csvFields)
	}, [setCsvFields, getDemographicValue, t, locale, service])
}
