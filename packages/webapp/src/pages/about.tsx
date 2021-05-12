/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IStackTokens, Stack, Text } from '@fluentui/react'
import Link from 'next/link'
import Layout from '~layouts/ContainerLayout'
const stackTokens: IStackTokens = { childrenGap: 40 }

export default function About(): JSX.Element {
	return (
		<Layout title='About us'>
			<Stack tokens={stackTokens}>
				<Text>
					Back to{' '}
					<Link href='/' as={process.env.BACKEND_URL + '/'}>
						<span>Home</span>
					</Link>
				</Text>
			</Stack>
		</Layout>
	)
}
