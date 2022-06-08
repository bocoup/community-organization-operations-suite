/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState } from 'react'
import { EditRequestForm } from '~forms/EditRequestForm'
import { Panel } from '~ui/Panel'
import type { StandardFC } from '~types/StandardFC'
import type { Engagement, EngagementInput } from '@cbosuite/schema/dist/client-types'
import { PaginatedList } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'

// Utils
import { wrap } from '~utils/appinsights'
import { sortByDuration } from '~utils/engagements'

// Hooks
import { useMobileColumns, usePageColumns } from './columns'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useEngagementList } from '~hooks/api/useEngagementList'
import { useEngagementSearchHandler } from '~hooks/useEngagementSearchHandler'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useWindowSize } from '~hooks/useWindowSize'

// Apollo
import { GET_USER_ACTIVES_ENGAGEMENTS } from '~queries'
import { useQuery } from '@apollo/client'

// Logs
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useEngagementList')

export const RequestList: StandardFC = wrap(function RequestList() {
	const { c, t } = useTranslation(Namespace.Requests)
	const { isMD } = useWindowSize()
	const { userId, orgId } = useCurrentUser()
	const { editEngagement, claimEngagement } = useEngagementList(orgId, userId)

	// Fetch the data
	const { loading, data } = useQuery(GET_USER_ACTIVES_ENGAGEMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { orgId: orgId, userId: userId },
		onError: (error) => logger(c('hooks.useEngagementList.loadDataFailed'), error)
	})
	const engagements = [...(data?.activeEngagements ?? [])]?.sort(sortByDuration)

	const [filteredList, setFilteredList] = useState<Engagement[]>(engagements)
	const [isEditFormOpen, { setTrue: openEditRequestPanel, setFalse: dismissEditRequestPanel }] =
		useBoolean(false)
	const [selectedEngagement, setSelectedEngagement] = useState<Engagement | undefined>()
	const searchList = useEngagementSearchHandler(engagements, setFilteredList)

	const handleEdit = useCallback(
		(values: EngagementInput) => {
			dismissEditRequestPanel()
			editEngagement(values)
		},
		[editEngagement, dismissEditRequestPanel]
	)

	const handleOnEdit = useCallback(
		(engagement: Engagement) => {
			setSelectedEngagement(engagement)
			openEditRequestPanel()
		},
		[setSelectedEngagement, openEditRequestPanel]
	)

	const pageColumns = usePageColumns((form: any) => claimEngagement(form.id, userId), handleOnEdit)
	const mobileColumn = useMobileColumns(
		(form: any) => claimEngagement(form.id, userId),
		handleOnEdit
	)

	return (
		<>
			<div className={cx('mt-5 mb-5', styles.requestList, 'requestList')}>
				<PaginatedList
					title={t('requestsTitle')}
					list={filteredList}
					itemsPerPage={isMD ? 10 : 5}
					columns={isMD ? pageColumns : mobileColumn}
					hideListHeaders={!isMD}
					rowClassName={isMD ? 'align-items-center' : undefined}
					onSearchValueChange={searchList}
					isLoading={loading}
					isMD={isMD}
					collapsible
					collapsibleStateName='isRequestsListOpen'
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissEditRequestPanel}>
				<EditRequestForm
					title={t('requestEditButton')}
					engagement={selectedEngagement}
					onSubmit={handleEdit}
				/>
			</Panel>
		</>
	)
})
