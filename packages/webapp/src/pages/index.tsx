/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEngagementList } from '~hooks/api/useEngagementList'
import ContainerLayout from '~layouts/ContainerLayout'
import MyRequestsList from '~lists/MyRequestsList'
import RequestList from '~lists/RequestList'
import InactiveRequestList from '~lists/InactiveRequestList'
import { useTranslation } from '~hooks/useTranslation'
import { memo } from 'react'
import getServerSideTranslations from '~utils/getServerSideTranslations'
import { useInactiveEngagementList } from '~hooks/api/useInactiveEngagementList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'

export const getStaticProps = getServerSideTranslations([
	'common',
	'requests',
	'footer',
	'specialists'
])

const HomePageBody = (): JSX.Element => {
	const { userId, orgId } = useCurrentUser()
	const { t } = useTranslation('requests')

	const {
		engagementList,
		myEngagementList,
		addEngagement: addRequest,
		editEngagement: editRequest,
		claimEngagement: claimRequest,
		loading
	} = useEngagementList(orgId, userId)

	const { inactiveEngagementList, loading: inactiveLoading } = useInactiveEngagementList(orgId)

	const handleEditMyEngagements = async (form: any) => {
		await handleEditEngagements({
			...form,
			userId
		})
	}

	const handleAddEngagements = async (form: any) => {
		await addRequest(form)
	}

	const handleEditEngagements = async (form: any) => {
		await editRequest(form)
	}

	const handleClaimEngagements = async (form: any) => {
		await claimRequest(form.id, userId)
	}

	return (
		<>
			<MyRequestsList
				title={t('myRequests.title')}
				requests={myEngagementList}
				onAdd={handleAddEngagements}
				onEdit={handleEditMyEngagements}
				loading={loading && myEngagementList.length === 0}
			/>
			<RequestList
				title={t('requests.title')}
				requests={engagementList}
				onEdit={handleEditEngagements}
				onClaim={handleClaimEngagements}
				loading={loading && engagementList.length === 0}
			/>
			<InactiveRequestList
				title={'Closed Requests'}
				requests={inactiveEngagementList}
				loading={inactiveLoading && inactiveEngagementList.length === 0}
			/>
		</>
	)
}

const Home = memo(function Home(): JSX.Element {
	const { t } = useTranslation('requests')

	return (
		<ContainerLayout documentTitle={t('page.title')}>
			<HomePageBody />
		</ContainerLayout>
	)
})

export default Home
