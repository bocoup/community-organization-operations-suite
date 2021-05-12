/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Layout from '~layouts/ContainerLayout'

export default function Profile(): JSX.Element {
	const router = useRouter()
	const { nid } = router.query

	useEffect(() => {
		console.log('nid', nid)
	}, [nid])

	return (
		<Layout title={`Navigator Page ${nid}`}>
			<span>Navigator Page</span>
		</Layout>
	)
}
