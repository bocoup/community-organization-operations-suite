/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useEffect, useCallback } from 'react'
import styles from './index.module.scss'
import { Col, Row, Container } from 'react-bootstrap'
import cx from 'classnames'
import { useWindowSize } from '~hooks/useWindowSize'
import { useTranslation } from '~hooks/useTranslation'
import { LoginForm } from '~components/forms/LoginForm'
import { useHistory } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'
import { StatusType } from '@cbosuite/schema/dist/client-types'

export const LoginPageBody = memo(function LoginPageBody({
	children
}: {
	children?: JSX.Element | JSX.Element[]
}): JSX.Element {
	const { t } = useTranslation('login')
	const { isMD } = useWindowSize()
	const rounded = isMD ? styles.formContainer : styles.formContainerNoRounded
	const history = useHistory()
	const handleLogin = useCallback(
		(status: string) => {
			if (status === StatusType.Success) {
				history.push('/')
			}
		},
		[history]
	)
	const error = usePathError()

	useEffect(() => {
		if (typeof localStorage !== undefined) localStorage.removeItem('recoil-persist')
	}, [])

	return (
		<div className={isMD ? styles.loginLayout : styles.loginLayoutSm}>
			<Container>
				<Row className='justify-content-center'>
					<Col md={8} className={styles.mainContainer}>
						{children ? (
							children
						) : (
							<Row className='align-items-center'>
								<Col sm={12} md={6} className={styles.header}>
									<h1 className='mb-5'>{t('header')}</h1>
									<p className={styles.subHeader}>{t('subHeader')}</p>
								</Col>
								<Col className={cx('shadow', rounded)}>
									<LoginForm onLoginClick={handleLogin} error={error} />
								</Col>
							</Row>
						)}
					</Col>
				</Row>
			</Container>
		</div>
	)
})

function usePathError(): string | undefined {
	const { c } = useTranslation('login')
	const [error, setError] = useState<string>()
	const { error: errorArg } = useLocationQuery()
	useEffect(() => {
		if (errorArg === 'UNAUTHENTICATED') {
			setError(c('errors.unauthenticated'))
		}
	}, [errorArg, c])
	return error
}
