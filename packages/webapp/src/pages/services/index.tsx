/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo } from 'react'
import ServiceList from '~components/lists/ServiceList'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'

const Services = memo(function Services(): JSX.Element {
	const { orgId } = useCurrentUser()
	const { serviceList, loading } = useServiceList(orgId)

	return (
		<ContainerLayout documentTitle={'Services'}>
			<ServiceList title={'Services'} services={serviceList} loading={loading} />
		</ContainerLayout>
	)
})
export default Services
