/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Service } from '@cbosuite/schema/dist/client-types'
import { useEffect, useMemo, useState } from 'react'
import { OptionType } from '~components/ui/ReactSelect'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { FilterOptions } from './ReportOptions'
import { ReportType } from './types'
import { useActiveServices } from './useActiveServices'

export function useReportTypeOptions(): OptionType[] {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Services)
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

export function useTopRowFilterOptions(reportType: ReportType): [Service, FilterOptions] {
	const { services } = useActiveServices()
	const [selectedService, setSelectedService] = useState<Service | null>(null)
	const [reportFilterOption, setReportFilterOption] = useState<FilterOptions | null>(null)
	const serviceFilterOptions = useReportFilterOptions(services, setSelectedService)

	useEffect(
		function handleReportTypeSelect() {
			// Update Header options
			if (reportType === ReportType.SERVICES) {
				setReportFilterOption(serviceFilterOptions)
			} else if (reportType === ReportType.CLIENTS) {
				setReportFilterOption(null)
				setSelectedService(null)
			}
		},
		[reportType, setReportFilterOption, serviceFilterOptions]
	)

	return [selectedService, reportFilterOption]
}