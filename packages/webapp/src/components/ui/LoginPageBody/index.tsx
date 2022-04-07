/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useEffect, useCallback } from 'react'
import styles from './index.module.scss'
import { Col, Row, Container } from 'react-bootstrap'
import cx from 'classnames'
import { useWindowSize } from '~hooks/useWindowSize'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { LoginForm } from '~components/forms/LoginForm'
import { useHistory } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'
import type { StandardFC } from '~types/StandardFC'
import { navigate } from '~utils/navigate'
import { ApplicationRoute } from '~types/ApplicationRoute'
import { clearStoredState } from '~utils/localStorage'
import { StatusType } from '~hooks/api'

export const LoginPageBody: StandardFC = memo(function LoginPageBody({ children }) {
	const { t } = useTranslation(Namespace.Login)
	const { isMD } = useWindowSize()
	const history = useHistory()
	const handleLogin = useCallback(
		(status: string) => {
			if (status === StatusType.Success) {
				navigate(history, ApplicationRoute.Index)
			}
		},
		[history]
	)
	const error = usePathError()

	useEffect(clearStoredState, [])

	return (
		<div className={isMD ? styles.loginLayout : styles.loginLayoutSm}>
			<Container>
				<Row className='justify-content-center'>
					<Col md={8}>
						{children ? (
							children
						) : (
							<Row className='align-items-center'>
								<Col sm={12} md={6} className={styles.header}>
									<h1 className='mb-5'>{t('header')}</h1>
									<p className={styles.subHeader}>{t('subHeader')}</p>
								</Col>
								<Col className={cx(styles.formContainer, isMD && 'formContainerMD')}>
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
	const { c } = useTranslation(Namespace.Login)
	const [error, setError] = useState<string>()
	const { error: errorArg } = useLocationQuery()
	useEffect(() => {
		if (errorArg === 'UNAUTHENTICATED') {
			setError(c('errors.unauthenticated'))
		}
	}, [errorArg, c])
	return error
}
