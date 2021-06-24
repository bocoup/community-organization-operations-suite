/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import Layout from '~layouts/ContainerLayout'

const Home = memo(function Home(): JSX.Element {
	return (
		<Layout title='Directory'>
			<span>Directory Page</span>
		</Layout>
	)
})
export default Home
