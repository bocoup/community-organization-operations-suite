/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import ServiceReportList from '~components/lists/ServiceReportList'
import { wrap } from '~utils/appinsights'

const Reporting = memo(function Reporting(): JSX.Element {
	const { orgId } = useCurrentUser()
	const { t } = useTranslation(['services', 'reporting'])
	const { serviceList, loading } = useServiceList(orgId)

	return (
		<ContainerLayout documentTitle={t('pageTitle')}>
			<ServiceReportList title={t('serviceListTitle')} services={serviceList} loading={loading} />
		</ContainerLayout>
	)
})

export default wrap(Reporting)
