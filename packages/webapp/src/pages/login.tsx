/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Layout from '~components/layouts/ContainerLayout'
import { useAuthUser } from '~hooks/api/useAuth'

import FormikField from '~ui/FormikField'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import { Formik, Form } from 'formik'

export default function LoginPage(): JSX.Element {
	const { login, authUser } = useAuthUser()
	const router = useRouter()
	const handleLogin = async values => {
		await login(values.username, values.password)
	}

	useEffect(() => {
		if (authUser?.accessToken) {
			void router.push('/')
		}
	}, [authUser])

	return (
		<Layout title='Login' showNav={false} size='sm' showTitle={false}>
			<p>Please Sign in to continue</p>
			<Formik
				initialValues={{
					username: '',
					password: ''
				}}
				onSubmit={handleLogin}
			>
				{({ values, errors }) => {
					return (
						<Form>
							<FormikField name='username' placeholder='Email' className='mb-3' />
							<FormikField
								name='password'
								placeholder='Password'
								className='mb-3'
								type='password'
							/>
							<FormikSubmitButton>Login</FormikSubmitButton>
						</Form>
					)
				}}
			</Formik>
		</Layout>
	)
}
