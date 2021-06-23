/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import Layout from '~layouts/ContainerLayout'

const Home = memo(function Home(): JSX.Element {
	return (
		<Layout>
			<h3 className='mt-5'>My Requests</h3>
			<h3 className='mt-5'>Requests</h3>
		</Layout>
	)
})
export default Home
