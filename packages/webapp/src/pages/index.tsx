/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GetStaticProps } from 'next'
import { useAuthUser } from '~hooks/api/useAuth'
import { useEngagementList } from '~hooks/api/useEngagementList'
import { useMyEngagementList } from '~hooks/api/useMyEngagementList'
import ContainerLayout from '~layouts/ContainerLayout'
import MyRequestsList from '~lists/MyRequestsList'
import RequestList from '~lists/RequestList'
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
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')

	const { myEngagementList, addEngagement: addMyRequest } = useMyEngagementList(
		userRole?.orgId,
		authUser?.user?.id
	)
	const { engagementList, addEngagement: addRequest } = useEngagementList(
		userRole?.orgId,
		authUser?.user?.id
	)

	const { data: orgData } = useOrganization(userRole?.orgId)

	const handleAddMyEngagements = async (form: any) => {
		await addMyRequest({
			...form,
			userId: authUser?.user.id
		})
	}

	const handleAddEngagements = async (form: any) => {
		await addRequest(form)
	}

	return (
		<ContainerLayout orgName={orgData?.name}>
			{authUser?.accessToken && (
				<>
					<MyRequestsList
						title='My Requests'
						requests={myEngagementList}
						onAdd={handleAddMyEngagements}
					/>
					<RequestList title='Requests' requests={engagementList} onAdd={handleAddEngagements} />
				</>
			)}
		</ContainerLayout>
	)
}
