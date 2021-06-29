/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GetStaticProps } from 'next'
import { useAuthUser } from '~hooks/api/useAuth'
import { useEngagementList } from '~hooks/api/useEngagementList'
import type { AuthenticationResponse } from '@greenlight/schema/lib/client-types'
import ContainerLayout from '~layouts/ContainerLayout'
import MyRequestsList from '~lists/MyRequestsList'
import RequestList from '~lists/RequestList'
import PageProps from '~types/PageProps'
import { get } from 'lodash'
import { useOrganization } from '~hooks/api/useOrganization'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { memo } from 'react'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'footer']))
		}
	}
	// try {
	// 	// TODO: Move this logic into a util... it will need to be called on every page... or move it to _app.tsx?
	// 	const intlResponse: { default: any } = await import(`../intl/${locale}.json`)
	// 	ret.props.copy = intlResponse.default
	// } catch (error) {
	// 	console.log('error', error)
	// }

	// return ret
}

interface HomePageProps extends PageProps {
	authUser?: AuthenticationResponse
}

const HomePageBody = ({ copy, authUser }: HomePageProps): JSX.Element => {
	// FIXME: this is not how we shold be getting the user role. Role needs to match the specific org
	const userRole = get(authUser, 'user.roles[0]')
	// const { t } = useTranslation('common')

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
			{/* {t('h1')} */}

			<MyRequestsList
				title='My Requests'
				requests={myEngagementList}
				onAdd={handleAddMyEngagements}
				onEdit={handleEditMyEngagements}
			/>
			<RequestList
				title='Requests'
				requests={engagementList}
				onAdd={handleAddEngagements}
				onEdit={handleEditEngagements}
				onClaim={handleClaimEngagements}
			/>
		</>
	)
}

const Home = memo(function Home({ copy }: PageProps): JSX.Element {
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)

	return (
		<ContainerLayout orgName={orgData?.name}>
			{authUser?.accessToken && <HomePageBody authUser={authUser} />}
		</ContainerLayout>
	)
})

export default Home
