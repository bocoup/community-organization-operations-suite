/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Contact,
	Service,
	ServiceAnswers,
	ServiceCustomField
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
		const customFields = service.customFields
		const getColumnItemValue = (answerItem: ServiceAnswers, field: ServiceCustomField): string => {
			let answerValue = ''

			const answers = answerItem.fieldAnswers[field.fieldType]?.find(
				(a) => a.fieldId === field.fieldId
			)
			if (answers) {
				const fieldValue = customFields.find((f) => f.fieldId === answers.fieldId).fieldValue

				if (Array.isArray(answers.values)) {
					answerValue = answers.values
						.map((v) => fieldValue.find((f) => f.id === v).label)
						.join(', ')
				} else {
					switch (field.fieldType) {
						case 'singleChoice':
							answerValue = fieldValue.find((f) => f.id === answers.values).label
							break
						case 'date':
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
				label: field.fieldName,
				value: (item: ServiceAnswers) => {
					return getColumnItemValue(item, field)
				}
			}
		})

		if (service.contactFormEnabled) {
			csvFields.unshift(
				{
					label: t('clientList.columns.name'),
					value: (item: ServiceAnswers) => {
						return `${item.contacts[0].name.first} ${item.contacts[0].name.last}`
					}
				},
				{
					label: t('demographics.gender.label'),
					value: (item: ServiceAnswers) => getDemographicValue('gender', item.contacts[0])
				},
				{
					label: t('demographics.race.label'),
					value: (item: ServiceAnswers) => getDemographicValue('race', item.contacts[0])
				},
				{
					label: t('demographics.ethnicity.label'),
					value: (item: ServiceAnswers) => getDemographicValue('ethnicity', item.contacts[0])
				}
			)
		}
		setCsvFields(csvFields)
	}, [setCsvFields, getDemographicValue, t, locale, service])
}
