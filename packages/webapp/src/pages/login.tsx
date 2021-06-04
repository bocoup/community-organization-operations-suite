/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthUser } from '~hooks/api/useAuth'
import FormikField from '~ui/FormikField'
import { Formik, Form } from 'formik'
import Head from 'next/head'
import { Col, Row, Container } from 'react-bootstrap'

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
	}, [router, authUser])

	return (
		<>
			<Head>
				<title>Greenlight - Community Health Resilience Tool</title>
				<link
					href='https://uploads-ssl.webflow.com/5fe5c5e2a8976c9be6b9a0e5/5fe5c5e2a8976c7d38b9a1d3_favicon.svg'
					rel='shortcut icon'
					type='image/x-icon'
				></link>
				<link
					href='https://uploads-ssl.webflow.com/5fe5c5e2a8976c9be6b9a0e5/5fee567345a05d2a674a4cdb_Icon.png'
					rel='apple-touch-icon'
				></link>
			</Head>
			<div
				className='d-flex justify-content-center align-items-center vertical-center'
				style={{ width: '100%', minHeight: '100vh' }}
			>
				<Container>
					<Row className='justify-content-center mb-5 pb-5'>
						<Col md={8} style={{ marginBottom: 50 }}>
							<Row className='mb-5'>
								<Col>
									<img
										src='https://uploads-ssl.webflow.com/5fe5c5e2a8976c9be6b9a0e5/5fe5c5e2a8976c6d21b9a137_logo.svg'
										style={{ width: '148px', height: '42px' }}
										alt='people walking in the background'
									/>
								</Col>
							</Row>
							<Row>
								<Col sm={12} md={6} style={{ padding: '20px 40px 20px 10px', color: 'white' }}>
									<h1 className='mb-5'>Welcome to Community Health Resilience Tool</h1>
									<p>
										Greenlight is a health resilience system leveraging the experience of a team
										that supported community efforts. We bring together three pillars to accelerate
										reopening and support community organizations address health and social
										disparities.
									</p>
								</Col>
								<Col
									className='shadow'
									style={{ padding: '20px', backgroundColor: '#d5dfea', borderRadius: 10 }}
								>
									<Row className='mb-2'>
										<h2>Login</h2>
									</Row>
									<Row className='mb-2'>
										<p>Please login to continue</p>
									</Row>
									<Row>
										<Formik
											initialValues={{
												username: '',
												password: ''
											}}
											onSubmit={handleLogin}
										>
											{({ submitCount }) => {
												return (
													<Form>
														<FormikField
															name='username'
															placeholder='Email'
															className='mb-3'
															style={{ padding: '12px', borderRadius: 10, border: 'none' }}
														/>
														<FormikField
															name='password'
															placeholder='Password'
															className='mb-3'
															type='password'
															style={{ padding: '12px', borderRadius: 10, border: 'none' }}
														/>
														{authUser?.message === 'Auth failure' && submitCount > 0 && (
															<div className='mb-2 text-danger'>
																Invalid email or password. Please try again.
															</div>
														)}
														<button
															type='submit'
															style={{
																marginTop: 30,
																borderRadius: 25,
																backgroundColor: '#2e3744',
																color: 'white',
																width: 150,
																border: 'none',
																padding: 10
															}}
														>
															Login
														</button>
													</Form>
												)
											}}
										</Formik>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundColor: '#2F9BED',
						transform: 'skew(0deg, -1.15deg)',
						top: 250,
						bottom: 250,
						zIndex: -1,
						backgroundImage: `url('https://uploads-ssl.webflow.com/5fe5c5e2a8976c9be6b9a0e5/5fe5c5e2a8976c3036b9a1eb_ill.png')`,
						backgroundSize: 'contain',
						backgroundPosition: 'center bottom',
						backgroundRepeat: 'no-repeat'
					}}
				>
					{/* <div style={{position: 'absolute', bottom: 0, right: 0, marginBottom: -30, marginRight: 40}}>
						Privacy Policy | Terms of Use | Copyright 2021.
					</div> */}
				</div>
			</div>
		</>
	)
}
