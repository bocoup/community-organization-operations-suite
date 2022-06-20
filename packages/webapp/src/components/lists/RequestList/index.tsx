/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useEffect, useState } from 'react'
import { EditRequestForm } from '~forms/EditRequestForm'
import { Panel } from '~ui/Panel'
import type { StandardFC } from '~types/StandardFC'
import type { Engagement, EngagementInput } from '@cbosuite/schema/dist/client-types'
import { PaginatedList } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'

// Utils
import { wrap } from '~utils/appinsights'

// Hooks
import { useMobileColumns, usePageColumns } from './columns'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useEngagementList } from '~hooks/api/useEngagementList'
import { useEngagementSearchHandler } from '~hooks/useEngagementSearchHandler'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useWindowSize } from '~hooks/useWindowSize'

type RequestsListProps = {
	engagements: Engagement[]
	loading: boolean
}

export const RequestList: StandardFC<RequestsListProps> = wrap(function RequestList({
	engagements,
	loading
}) {
	const { t } = useTranslation(Namespace.Requests)
	const { isMD } = useWindowSize()
	const { userId, orgId } = useCurrentUser()
	const { editEngagement, claimEngagement } = useEngagementList(orgId, userId)

	const [filteredList, setFilteredList] = useState<Engagement[]>(engagements)
	const [isEditFormOpen, { setTrue: openEditRequestPanel, setFalse: dismissEditRequestPanel }] =
		useBoolean(false)
	const [selectedEngagement, setSelectedEngagement] = useState<Engagement | undefined>()
	const searchList = useEngagementSearchHandler(engagements, setFilteredList)

	// Update the filteredList when useQuery triggers.
	// TODO: This is an ugly hack based on the fact that the search is handle here,
	// but triggered by a child component. PaginatedList component needs to be fixed.
	useEffect(() => {
		if (engagements) {
			const searchField = document.querySelector(
				'.requestList input[type=text]'
			) as HTMLInputElement
			searchList(searchField?.value ?? '')
		}
	}, [engagements, searchList])

	const handleEdit = (values: EngagementInput) => {
		dismissEditRequestPanel()
		editEngagement(values)
	}

	const handleOnEdit = (engagement: Engagement) => {
		setSelectedEngagement(engagement)
		openEditRequestPanel()
	}

	const pageColumns = usePageColumns((form: any) => claimEngagement(form.id, userId), handleOnEdit)
	const mobileColumn = useMobileColumns(
		(form: any) => claimEngagement(form.id, userId),
		handleOnEdit
	)

	const rowClassName = isMD ? 'align-items-center' : undefined

	return (
		<>
			<div className={cx('mt-5 mb-5', styles.requestList, 'requestList')}>
				<PaginatedList
					title={t('requestsTitle')}
					list={filteredList}
					itemsPerPage={isMD ? 10 : 5}
					columns={isMD ? pageColumns : mobileColumn}
					hideListHeaders={!isMD}
					rowClassName={rowClassName}
					onSearchValueChange={searchList}
					isLoading={loading && filteredList.length === 0}
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
