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
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { CsvField } from '../../types'

export function useServiceReportCsvFields(
	service: Service,
	setCsvFields: (fields: Array<CsvField>) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	hiddenFields: Record<string, boolean>
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Services)
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
					const value = answers.values || answers.value
					switch (field.type) {
						case ServiceFieldType.SingleChoice:
							answerValue = fieldValue.find((f) => f.id === answers.value)?.label
							break
						case ServiceFieldType.Date:
							answerValue = new Date(value).toLocaleDateString(locale)
							break
						default:
							answerValue = value
					}
				}
			} else {
				answerValue = ''
			}

			return answerValue
		}

		const csvFields = customFields.map((field) => {
			return {
				key: field.id,
				label: field.name,
				value: (item: ServiceAnswer) => {
					return getColumnItemValue(item, field)
				}
			}
		})

		if (service.contactFormEnabled) {
			csvFields.unshift(
				{
					key: 'name',
					label: t('clientList.columns.name'),
					value: (item: ServiceAnswer) => {
						return `${item.contacts[0].name.first} ${item.contacts[0].name.last}`
					}
				},
				{
					key: 'gender',
					label: t('demographics.gender.label'),
					value: (item: ServiceAnswer) => getDemographicValue('gender', item.contacts[0])
				},
				{
					key: 'dateOfBirth',
					label: t('customFilters.birthdate'),
					value: (item: ServiceAnswer) =>
						new Date(item.contacts[0].dateOfBirth).toLocaleDateString(locale)
				},
				{
					key: 'race',
					label: t('demographics.race.label'),
					value: (item: ServiceAnswer) => getDemographicValue('race', item.contacts[0])
				},
				{
					key: 'ethnicity',
					label: t('demographics.ethnicity.label'),
					value: (item: ServiceAnswer) => getDemographicValue('ethnicity', item.contacts[0])
				},
				{
					key: 'preferredLanguage',
					label: t('demographics.preferredLanguage.label'),
					value: (item: ServiceAnswer) => getDemographicValue('preferredLanguage', item.contacts[0])
				},
				{
					key: 'preferredContactMethod',
					label: t('demographics.preferredContactMethod.label'),
					value: (item: ServiceAnswer) =>
						getDemographicValue('preferredContactMethod', item.contacts[0])
				},
				{
					key: 'preferredContactTime',
					label: t('demographics.preferredContactTime.label'),
					value: (item: ServiceAnswer) =>
						getDemographicValue('preferredContactTime', item.contacts[0])
				},
				{
					key: 'street',
					label: t('customFilters.street'),
					value: (item: ServiceAnswer) => item?.contacts[0]?.address?.street
				},
				{
					key: 'unit',
					label: t('customFilters.unit'),
					value: (item: ServiceAnswer) => item?.contacts[0]?.address?.unit
				},
				{
					key: 'city',
					label: t('customFilters.city'),
					value: (item: ServiceAnswer) => item?.contacts[0]?.address?.city
				},
				{
					key: 'county',
					label: t('customFilters.county'),
					value: (item: ServiceAnswer) => item?.contacts[0]?.address?.county
				},
				{
					key: 'state',
					label: t('customFilters.state'),
					value: (item: ServiceAnswer) => item?.contacts[0]?.address?.state
				},
				{
					key: 'zip',
					label: t('customFilters.zip'),
					value: (item: ServiceAnswer) => item?.contacts[0]?.address?.zip
				},
				{
					key: 'tags',
					label: t('customFilters.tags'),
					value: (item: ServiceAnswer) => {
						if (item?.contacts[0]?.tags?.length > 0) {
							let tags = ''
							item.contacts[0].tags.forEach((tag) => {
								tags += tag.label + ', '
							})
							return tags.slice(0, -2)
						}
						return ''
					}
				}
			)
		}
		setCsvFields(
			csvFields.filter((f) => !hiddenFields[f.key]).map((f) => ({ label: f.label, value: f.value }))
		)
	}, [setCsvFields, getDemographicValue, t, locale, service, hiddenFields])
}
