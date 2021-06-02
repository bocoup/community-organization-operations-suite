/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GetStaticProps } from 'next'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAuthUser } from '~hooks/api/useAuth'
import { useEngagementList } from '~hooks/api/useEngagementList'
import ContainerLayout from '~layouts/ContainerLayout'
import MyRequestsList from '~lists/MyRequestsList'
import { loadSpecialists } from '~slices/navigatorsSlice'
import PageProps from '~types/PageProps'
import { get } from 'lodash'
import { useOrganization } from '~hooks/api/useOrganization'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	const ret = { props: { copy: {} } }

	try {
		// TODO: Move this logic into a util... it will need to be called on every page... or move it to _app.tsx?
		const intlResponse: { default: any } = await import(`../intl/${locale}.json`)
		ret.props.copy = intlResponse.default
	} catch (error) {
		console.log('error', error)
	}

	return ret
}

export default function Home({ copy }: PageProps): JSX.Element {
	const dispatch = useDispatch()

	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: myRequestData } = useEngagementList(
		userRole?.orgId,
		undefined,
		undefined,
		authUser?.user?.id,
		false
	)
	const { data: requestData } = useEngagementList(
		userRole?.orgId,
		undefined,
		undefined,
		authUser?.user?.id,
		true
	)

	const { data: orgData } = useOrganization(userRole?.orgId)

	useEffect(() => {
		dispatch(loadSpecialists(orgData))
	}, [orgData, dispatch])

	return (
		<ContainerLayout orgName={orgData?.name}>
			{authUser?.accessToken && (
				<>
					{myRequestData && myRequestData?.length > 0 && (
						<MyRequestsList title='My Requests' requests={myRequestData} />
					)}
					{requestData && requestData?.length > 0 && (
						<MyRequestsList title='Requests' requests={requestData} />
					)}
				</>
			)}
		</ContainerLayout>
	)
}
