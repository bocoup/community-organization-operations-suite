/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Service } from '@cbosuite/schema/dist/client-types'
import { ServiceStatus } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useServiceList } from '~hooks/api/useServiceList'
import { empty } from '~utils/noop'

export function useActiveServices() {
	const { orgId } = useCurrentUser()
	const { serviceList, loading } = useServiceList(orgId)
	const services = useMemo<Service[]>(
		() => serviceList.filter((service) => service.status !== ServiceStatus.Archive) ?? empty,
		[serviceList]
	)
	return useMemo(
		() => ({
			services,
			loading
		}),
		[services, loading]
	)
}
