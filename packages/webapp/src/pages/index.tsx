/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEngagementList } from '~hooks/api/useEngagementList'
import { MyRequestsList } from '~lists/MyRequestsList'
import { RequestList } from '~lists/RequestList'
import { InactiveRequestList } from '~lists/InactiveRequestList'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useCallback, useMemo, useState } from 'react'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { PageTopButtons } from '~components/ui/PageTopButtons'
import { Title } from '~components/ui/Title'
import { NewFormPanel } from '~components/ui/NewFormPanel'
import { useOffline } from '~hooks/useOffline'
import { getPreQueueRequest, setPreQueueRequest } from '~utils/localCrypto'
import { config } from '~utils/config'

// Types
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import type { FC } from 'react'
import type { IPageTopButtons } from '~components/ui/PageTopButtons'

// Apollo
import { GET_ENGAGEMENTS } from '~queries'
import { useQuery } from '@apollo/client'

// Utils
import { wrap } from '~utils/appinsights'
import { sortByDuration, sortByIsLocal } from '~utils/engagements'

const HomePage: FC = wrap(function Home() {
	const { t } = useTranslation(Namespace.Requests)
	const { userId, orgId } = useCurrentUser()
	const { addEngagement } = useEngagementList(orgId, userId)
	const isOffline = useOffline()
	const [openNewFormPanel, setOpenNewFormPanel] = useState(false)
	const [newFormName, setNewFormName] = useState(null)
	const isDurableCacheEnabled = Boolean(config.features.durableCache.enabled)
	const saveQueuedData = (value) => {
		const queue: any[] = getPreQueueRequest()
		queue.push(value)
		setPreQueueRequest(queue)
	}

	const buttons: IPageTopButtons[] = [
		{
			title: t('requestPageTopButtons.newRequestTitle'),
			buttonName: t('requestPageTopButtons.newRequestButtonName'),
			iconName: 'CircleAdditionSolid',
			className: 'btnNewRequest',
			onButtonClick: () => {
				setOpenNewFormPanel(true)
				setNewFormName('addRequestForm')
			}
		},
		{
			title: t('requestPageTopButtons.newServiceTitle'),
			buttonName: t('requestPageTopButtons.newServiceButtonName'),
			className: 'btnStartService',
			onButtonClick: () => {
				setOpenNewFormPanel(true)
				setNewFormName('startServiceForm')
			}
		},
		{
			title: t('requestPageTopButtons.newClientTitle'),
			buttonName: t('requestPageTopButtons.newClientButtonName'),
			iconName: 'CircleAdditionSolid',
			className: 'btnAddClient',
			onButtonClick: () => {
				setOpenNewFormPanel(true)
				setNewFormName('addClientForm')
			}
		}
	]

	const handleNewFormPanelSubmit = useCallback(
		(values: any) => {
			switch (newFormName) {
				case 'addRequestForm':
					if (isOffline && isDurableCacheEnabled) {
						saveQueuedData(values)
						addEngagement(values)
					} else {
						addEngagement(values)
					}
					break
			}
		},
		[addEngagement, newFormName, isOffline, isDurableCacheEnabled]
	)

	// Fetch allEngagements
	const { data, loading } = useQuery(GET_ENGAGEMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { orgId: orgId }
	})

	// Update the Query cached results with the subscription
	// https://www.apollographql.com/docs/react/data/subscriptions#subscribing-to-updates-for-a-query
	/* useEffect(() => {
		subscribeToMore({
			document: SUBSCRIBE_TO_ORG_ENGAGEMENTS,
			variables: { orgId: orgId },
			updateQuery: (previous, { subscriptionData }) => {
				if (!subscriptionData || !subscriptionData?.data?.engagements) {
					return previous
				}

				const { action, engagement, message } = subscriptionData.data.engagements
				if (message !== 'Success') return previous

				// Setup the engagements to replace in the cache
				let userActiveEngagements = [...previous.userActiveEngagements]

				// If it's a CLOSED or COMPLETED, we remove it
				if (['CLOSED', 'COMPLETED'].includes(action)) {
					userActiveEngagements = userActiveEngagements.filter((e) => e.id !== engagement.id)
				}

				// If it's a new or existing engagement from the currentUser, we update it
				if (['UPDATE', 'CREATED'].includes(action)) {
					userActiveEngagements = userActiveEngagements.filter((e) => e.id !== engagement.id)
					if (engagement?.user?.id === userId) {
						userActiveEngagements = [...userActiveEngagements, engagement]
					}
				}

				return { activeEngagements: previous.activeEngagements, userActiveEngagements }
			}
		})
	}, [orgId, userId, subscribeToMore]) */

	// Memoized the Engagements to only update when useQuery is triggered
	const engagements: Engagement[] = useMemo(() => [...(data?.allEngagements ?? [])], [data])

	// Split the engagements per lists
	const { userEngagements, otherEngagements, inactivesEngagements } = useMemo(
		() =>
			engagements
				.sort(sortByDuration)
				.sort(sortByIsLocal)
				.reduce(
					function (lists, engagement) {
						if (['CLOSED', 'COMPLETED'].includes(engagement.status)) {
							lists.inactivesEngagements.push(engagement)
						} else {
							if (engagement?.user?.id === userId) {
								lists.userEngagements.push(engagement)
							} else {
								lists.otherEngagements.push(engagement)
							}
						}
						return lists
					},
					{
						userEngagements: [] as Engagement[],
						otherEngagements: [] as Engagement[],
						inactivesEngagements: [] as Engagement[]
					}
				),
		[engagements, userId]
	)

	return (
		<>
			<Title title={t('pageTitle')} />

			<NewFormPanel
				showNewFormPanel={openNewFormPanel}
				newFormPanelName={newFormName}
				onNewFormPanelDismiss={() => setOpenNewFormPanel(false)}
				onNewFormPanelSubmit={handleNewFormPanelSubmit}
			/>
			<PageTopButtons buttons={buttons} />
			<MyRequestsList engagements={userEngagements} loading={loading} />
			<RequestList engagements={otherEngagements} loading={loading} />
			<InactiveRequestList engagements={inactivesEngagements} loading={loading} />
		</>
	)
})

export default HomePage
