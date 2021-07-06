/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useAuthUser } from '~hooks/api/useAuth'
import { useEngagementList } from '~hooks/api/useEngagementList'
import type { AuthenticationResponse } from '@greenlight/schema/lib/client-types'
import ContainerLayout from '~layouts/ContainerLayout'
import MyRequestsList from '~lists/MyRequestsList'
import RequestList from '~lists/RequestList'
import PageProps from '~types/PageProps'
import { get } from 'lodash'
import { useOrganization } from '~hooks/api/useOrganization'
import { useTranslation } from '~hooks/useTranslation'
import { memo } from 'react'
import getServerSideTranslations from '~utils/getServerSideTranslations'

export const getStaticProps = getServerSideTranslations(['common', 'requests', 'footer'])

interface HomePageProps extends PageProps {
	authUser?: AuthenticationResponse
}

const HomePageBody = ({ authUser }: HomePageProps): JSX.Element => {
	// FIXME: this is not how we shold be getting the user role. Role needs to match the specific org
	const userRole = get(authUser, 'user.roles[0]')
	const { t } = useTranslation('requests')

	const {
		engagementList,
		myEngagementList,
		addEngagement: addRequest,
		editEngagement: editRequest,
		claimEngagement: claimRequest
	} = useEngagementList(userRole?.orgId, authUser?.user?.id)

	const handleAddMyEngagements = async (form: any) => {
		await handleAddEngagements({
			...form,
			userId: authUser?.user.id
		})
	}

	const handleEditMyEngagements = async (form: any) => {
		await handleEditEngagements({
			...form,
			userId: authUser?.user.id
		})
	}

	const handleAddEngagements = async (form: any) => {
		await addRequest(form)
	}

	const handleEditEngagements = async (form: any) => {
		await editRequest(form)
	}

	const handleClaimEngagements = async (form: any) => {
		await claimRequest(form.id, authUser?.user.id)
	}

	return (
		<>
			<MyRequestsList
				title={t('myRequests.title')}
				requests={myEngagementList}
				onAdd={handleAddMyEngagements}
				onEdit={handleEditMyEngagements}
			/>
			<RequestList
				title={t('requests.title')}
				requests={engagementList}
				onAdd={handleAddEngagements}
				onEdit={handleEditEngagements}
				onClaim={handleClaimEngagements}
			/>
		</>
	)
}

const Home = memo(function Home(): JSX.Element {
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)
	const { t } = useTranslation('requests')

	return (
		<ContainerLayout orgName={orgData?.name} documentTitle={t('page.title')}>
			{authUser?.accessToken && <HomePageBody authUser={authUser} />}
		</ContainerLayout>
	)
})

export default Home
