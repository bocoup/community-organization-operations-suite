/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact, ContactStatus, Service, ServiceStatus } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { OptionType } from '~components/ui/ReactSelect'
import { useContacts } from '~hooks/api/useContacts'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useServiceList } from '~hooks/api/useServiceList'
import { useTranslation } from '~hooks/useTranslation'
import { empty } from '~utils/noop'
import { ReportTypes } from './types'

export function useActiveClients() {
	const { contacts } = useContacts()
	return useMemo<Contact[]>(
		() => contacts?.filter((contact) => contact.status !== ContactStatus.Archived) ?? empty,
		[contacts]
	)
}

export function useActiveServices() {
	const { orgId } = useCurrentUser()
	const { serviceList, loading, deleteServiceAnswer, updateServiceAnswer } = useServiceList(orgId)
	const activeServices = useMemo<Service[]>(
		() => serviceList.filter((service) => service.serviceStatus !== ServiceStatus.Archive) ?? empty,
		[serviceList]
	)
	return useMemo(
		() => ({
			activeServices,
			isServicesLoading: loading,
			deleteServiceAnswer,
			updateServiceAnswer
		}),
		[activeServices, loading, deleteServiceAnswer, updateServiceAnswer]
	)
}

export function useReportListOptions(): OptionType[] {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	return useMemo(
		() => [
			{ label: t('clientsTitle'), value: ReportTypes.CLIENTS },
			{ label: t('servicesTitle'), value: ReportTypes.SERVICES }
		],
		[t]
	)
}
