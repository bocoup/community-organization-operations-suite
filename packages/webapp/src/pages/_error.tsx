/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import router from 'next/router'

function Error({ statusCode }) {
	return (
		<p>
			{statusCode ? `An error ${statusCode} occurred on server:` : 'An error occurred on client'}
		</p>
	)
}

Error.getInitialProps = async ({ res }) => {
	if (res) {
		// server
		res.writeHead(302, {
			Location: '/notFound'
		})
		res.end()
	} else {
		router.push('/notFound')
	}
}

export default Error
