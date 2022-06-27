/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useEffect, useState } from 'react'
import cx from 'classnames'
import styles from './index.module.scss'
import { EditRequestForm } from '~forms/EditRequestForm'
import { Panel } from '~ui/Panel'
import { PaginatedList } from '~components/ui/PaginatedList'

// Types
import type { Engagement, EngagementInput } from '@cbosuite/schema/dist/client-types'
import type { IMultiActionButtons } from '~ui/MultiActionButton2'
import type { StandardFC } from '~types/StandardFC'

// Utils
import { wrap } from '~utils/appinsights'

// Hooks
import { useEngagementList } from '~hooks/api/useEngagementList'
import { useMobileColumns, usePageColumns } from './columns'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useEngagementSearchHandler } from '~hooks/useEngagementSearchHandler'
import { useWindowSize } from '~hooks/useWindowSize'

type RequestsListProps = {
	engagements: Engagement[]
	loading: boolean
}

export const MyRequestsList: StandardFC<RequestsListProps> = wrap(function MyRequestsList({
	engagements,
	loading
}) {
	const { t } = useTranslation(Namespace.Requests)
	const { isMD } = useWindowSize()
	const { userId, orgId } = useCurrentUser()
	const { editEngagement } = useEngagementList(orgId, userId)

	const [isEditFormOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false)
	const [filteredList, setFilteredList] = useState<Engagement[]>(engagements)
	const [engagement, setSelectedEngagement] = useState<Engagement | undefined>()
	const searchList = useEngagementSearchHandler(engagements, setFilteredList)

	// Update the filteredList when useQuery triggers.
	// TODO: This is an ugly hack based on the fact that the search is handle here,
	// but triggered by a child component. PaginatedList component needs to be fixed.
	useEffect(() => {
		if (engagements) {
			const searchField = document.querySelector(
				'.myRequestList input[type=text]'
			) as HTMLInputElement
			searchList(searchField?.value ?? '')
		}
	}, [engagements, searchList])

	const handleEdit = (values: EngagementInput) => {
		dismissPanel()
		editEngagement(values)
	}

	const columnActionButtons: IMultiActionButtons<Engagement>[] = [
		{
			name: t('requestListRowActions.edit'),
			className: cx(styles.editButton),
			onActionClick(engagement: Engagement) {
				setSelectedEngagement(engagement)
				openPanel()
			}
		}
	]

	const pageColumns = usePageColumns(columnActionButtons)
	const mobileColumns = useMobileColumns(columnActionButtons)

	const rowClassName = isMD ? 'align-items-center' : undefined

	return (
		<>
			<div className='mt-5 mb-5 myRequestList'>
				<PaginatedList
					title={t('myRequestsTitle')}
					list={filteredList}
					itemsPerPage={isMD ? 10 : 5}
					columns={isMD ? pageColumns : mobileColumns}
					hideListHeaders={!isMD}
					rowClassName={rowClassName}
					onSearchValueChange={searchList}
					isLoading={loading && filteredList.length === 0}
					isMD={isMD}
					collapsible
					collapsibleStateName='isMyRequestsListOpen'
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissPanel}>
				<EditRequestForm
					title={t('requestEditButton')}
					engagement={engagement}
					onSubmit={handleEdit}
				/>
			</Panel>
		</>
	)
})
