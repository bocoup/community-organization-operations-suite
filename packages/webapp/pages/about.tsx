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
						<a>Home</a>
					</Link>
				</Text>
			</Stack>
		</Layout>
	)
}
