import { useSelector } from 'react-redux'
import Layout from '~components/layouts/ContainerLayout'
import { getAuthUser } from '~store/slices/auth'

export default function AccountPage(): JSX.Element {
	const auth = useSelector(getAuthUser)
	const { firstName, lastName } = auth.user?.data || {}

	return (
		<Layout title='Account Info'>
			<p>
				name: {firstName} {lastName}
			</p>
			<p>accessToken: {auth.user?.credential?.accessToken}</p>
		</Layout>
	)
}
