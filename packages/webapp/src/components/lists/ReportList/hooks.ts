/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Service } from '@cbosuite/schema/dist/client-types'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import { OptionType } from '~components/ui/ReactSelect'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { selectedReportServiceState } from '~store'
import { FilterOptions } from './ReportOptions'
import { ReportType } from './types'
import { useActiveServices } from './useActiveServices'

export function useReportTypeOptions(): OptionType[] {
	const { t } = useTranslation(
		Namespace.Reporting,
		Namespace.Clients,
		Namespace.Requests,
		Namespace.Services
	)
	return useMemo(
		() => [
			{ label: t('clientsTitle'), value: ReportType.CLIENTS },
			{ label: t('requestsTitle'), value: ReportType.REQUESTS },
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

export function useTopRowFilterOptions(reportType: ReportType): [Service, FilterOptions] {
	const { services } = useActiveServices()
	const [selectedService, setSelectedService] = useRecoilState(selectedReportServiceState)
	const [reportFilterOptions, setReportFilterOption] = useState<FilterOptions | null>(null)
	const serviceFilterOptions = useReportFilterOptions(services, setSelectedService)

	useEffect(
		function handleReportTypeSelect() {
			// Update Header options
			if (reportType) {
				if (reportType === ReportType.SERVICES) {
					setReportFilterOption(serviceFilterOptions)
				} else {
					setReportFilterOption(null)
					setSelectedService(null)
				}
			}
		},
		[reportType, setReportFilterOption, serviceFilterOptions, setSelectedService]
	)

	return [selectedService, reportFilterOptions]
}

export function useInitializeFilters(filters, setFilters, buildFilters) {
	useEffect(() => {
		const defaultFilters = buildFilters?.() ?? []

		// If filters have been set locally
		if (filters.length > 0) {
			const _f = filters.map((f) => f.id).sort()
			const _df = defaultFilters.map((f) => f.id).sort()

			// Hacky way to check if report type has changed
			if (!(_f.join(',') === _df.join(','))) {
				setFilters?.(defaultFilters)
			}
		}

		// If filters have not been set
		else if (!filters?.length) setFilters?.(defaultFilters)
	}, [filters, setFilters, buildFilters])
}

export function useGetValue(filters) {
	const getSelectedValue = (key: string): string | number | string[] | number[] | undefined => {
		return filters.find((f) => f.id === key)?.value
	}

	const getStringValue = (key: string): string | undefined => {
		return filters.find((f) => f.id === key)?.value?.[0]
	}

	return { getSelectedValue, getStringValue }
}
