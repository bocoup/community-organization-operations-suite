/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GetStaticProps } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAuthUser } from '~hooks/api/useAuth'
import { useEngagementList } from '~hooks/api/useEngagementList'
import ContainerLayout from '~layouts/ContainerLayout'
import MyRequestsList from '~lists/MyRequestsList'
import RequestList from '~lists/RequestList'
import { loadSpecialists } from '~slices/navigatorsSlice'
import PageProps from '~types/PageProps'
import { get } from 'lodash'
import { useOrganization } from '~hooks/api/useOrganization'
import { Engagement } from '@greenlight/schema/lib/client-types'

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

	const {
		data: myRequestData,
		fetchMore: fetchMoreMyRequests,
		refetch: refetchMyRequests,
		addEngagement: addMyRequest
	} = useEngagementList(userRole?.orgId, 0, 10, authUser?.user?.id, false)
	const {
		data: requestData,
		fetchMore: fetchMoreRequests,
		refetch: refetchRequests,
		addEngagement: addRequest
	} = useEngagementList(userRole?.orgId, 0, 10, authUser?.user?.id, true)

	const [lastPage, setLastPage] = useState<number>(0)
	const getMoreEngagements = useCallback(
		(_items: Engagement[], currentPage: number) => {
			if (lastPage < currentPage) {
				fetchMoreRequests({
					variables: {
						offset: requestData.length,
						limit: 10
					}
				}).then(() => {
					setLastPage(currentPage)
				})
			}
		},
		[fetchMoreRequests, requestData, lastPage]
	)

	const [myLastPage, setMyLastPage] = useState<number>(0)
	const getMoreMyEngagements = async (_items: Engagement[], currentPage: number) => {
		if (myLastPage < currentPage) {
			await fetchMoreMyRequests({
				variables: {
					offset: requestData.length,
					limit: 10
				}
			})

			setMyLastPage(currentPage)
		}
	}

	const { data: orgData } = useOrganization(userRole?.orgId)

	useEffect(() => {
		dispatch(loadSpecialists(orgData))
	}, [orgData, dispatch])

	const handleAddMyEngagements = async (form: any) => {
		await addMyRequest({
			...form,
			userId: authUser?.user.id
		})

		await refetchMyRequests({
			variables: {
				offset: Math.max(myRequestData.length - 10, 0),
				limit: 10
			}
		})
	}

	const handleAddEngagements = async (form: any) => {
		await addRequest(form)

		await refetchRequests({
			variables: {
				offset: Math.max(requestData.length - 10, 0),
				limit: 10
			}
		})
	}

	return (
		<ContainerLayout orgName={orgData?.name}>
			{authUser?.accessToken && (
				<>
					<MyRequestsList
						title='My Requests'
						requests={myRequestData}
						onPageChange={getMoreMyEngagements}
						onAdd={handleAddMyEngagements}
					/>
					<RequestList
						title='Requests'
						requests={requestData}
						onPageChange={getMoreEngagements}
						onAdd={handleAddEngagements}
					/>
				</>
			)}
		</ContainerLayout>
	)
}
