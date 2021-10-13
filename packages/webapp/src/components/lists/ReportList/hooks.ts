/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact, Service } from '@cbosuite/schema/dist/client-types'
import { IDropdownOption } from '@fluentui/react'
import { useCallback, useMemo } from 'react'
import { OptionType } from '~components/ui/ReactSelect'
import { useTranslation } from '~hooks/useTranslation'
import { IFieldFilter, ReportType } from './types'

export function useReportTypeOptions(): OptionType[] {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	return useMemo(
		() => [
			{ label: t('clientsTitle'), value: ReportType.CLIENTS },
			{ label: t('servicesTitle'), value: ReportType.SERVICES }
		],
		[t]
	)
}

export function useReportFilterOptions(
	services: Service[],
	setSelectedService: (svc: Service) => void
) {
	return useMemo(
		() => ({
			options: services.map((service) => ({
				label: service.name,
				value: service
			})),
			// load the selected service data when it's selected
			onChange: (option: OptionType) => setSelectedService(option?.value)
		}),
		[services, setSelectedService]
	)
}

export function useFilterHelpers(
	filters: IFieldFilter[],
	setReportHeaderFilters: (filters: Array<IFieldFilter>) => void
) {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	const filterColumns = useCallback(
		(columnId: string, option: IDropdownOption) => {
			const fieldIndex = filters.findIndex((f) => f.id === columnId)
			if (option.selected) {
				const newFilters = [...filters]
				const value = newFilters[fieldIndex]?.value as string[]
				if (!value.includes(option.key as string)) {
					value.push(option.key as string)
				}
				setReportHeaderFilters(newFilters)
			} else {
				const newFilters = [...filters]
				const value = newFilters[fieldIndex]?.value as string[]
				const optionIndex = value.indexOf(option.key as string)
				if (optionIndex > -1) {
					value.splice(optionIndex, 1)
				}
				setReportHeaderFilters(newFilters)
			}
		},
		[filters, setReportHeaderFilters]
	)
	const filterRangedValues = useCallback(
		(key: string, value: string[]) => {
			const newFilters = [...filters]
			newFilters[filters.findIndex((f) => f.id === key)].value = value
			setReportHeaderFilters(newFilters)
		},
		[filters, setReportHeaderFilters]
	)
	const filterColumnTextValue = useCallback(
		(key: string, value: string) => {
			filterRangedValues(key, [value])
		},
		[filterRangedValues]
	)
	const getDemographicValue = useCallback(
		(demographicKey: string, contact: Contact): string => {
			switch (contact?.demographics?.[demographicKey]) {
				case '':
				case 'unknown':
					return ''
				case 'other':
					const otherKey = `${demographicKey}Other`
					return contact?.demographics?.[otherKey]
				default:
					return t(
						`demographics.${demographicKey}.options.${contact?.demographics?.[demographicKey]}`
					)
			}
		},
		[t]
	)

	return { filterColumns, filterColumnTextValue, filterRangedValues, getDemographicValue }
}
