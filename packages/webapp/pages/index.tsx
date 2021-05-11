/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GetStaticProps } from 'next'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { useDispatch, useSelector } from 'react-redux'
import Layout from '~layouts/ContainerLayout'
import MyRequestsList from '~lists/MyRequestsList'
import NavigatorsList from '~lists/NavigatorsList'
// import { getAuthUser } from '~slices/auth'
import { loadMyRequests } from '~slices/myRequestsSlice'
import { loadSpecialists } from '~slices/navigatorsSlice'
import PageProps from '~types/PageProps'

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
	console.log('copy', copy)

	// TODO: add auth back in
	// const auth = useSelector(getAuthUser)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(loadMyRequests())
		dispatch(loadSpecialists())
	}, [dispatch])

	// if (!auth.signedIn) {
	// 	return null
	// }

	return (
		<Layout>
			<MyRequestsList />
			<MyRequestsList title='Requests' />
			<NavigatorsList />
		</Layout>
	)
}
