/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Row, Col } from 'react-bootstrap'
import { FormikField } from '~ui/FormikField'
import { Formik, Form } from 'formik'
import cx from 'classnames'
import { useAuthUser } from '~hooks/api/useAuth'
import { useCallback, useState } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { wrap } from '~utils/appinsights'
import { Checkbox } from '@fluentui/react'
import { noop } from '~utils/noop'
import { useNavCallback } from '~hooks/useNavCallback'
import { ApplicationRoute } from '~types/ApplicationRoute'
import {
	clearUser,
	testPassword,
	setCurrentUser,
	checkSalt,
	APOLLO_KEY,
	setPwdHash,
	setPreQueueLoadRequired
} from '~utils/localCrypto'
import { createLogger } from '~utils/createLogger'
import localforage from 'localforage'
import { config } from '~utils/config'
import { useStore } from 'react-stores'
import { currentUserStore } from '~utils/current-user-store'
import * as CryptoJS from 'crypto-js'
const logger = createLogger('authenticate')

interface LoginFormProps {
	onLoginClick?: (status: string) => void
	error?: string
}

export const LoginForm: StandardFC<LoginFormProps> = wrap(function LoginForm({
	onLoginClick = noop,
	error
}) {
	const isDurableCacheEnabled = Boolean(config.features.durableCache.enabled)
	const localUserStore = useStore(currentUserStore)
	const { t } = useTranslation(Namespace.Login)
	const { login } = useAuthUser()
	const [acceptedAgreement, setAcceptedAgreement] = useState(false)

	const handleLoginClick = useCallback(
		async (values) => {
			const resp = await login(values.username, values.password)

			if (isDurableCacheEnabled) {
				setPreQueueLoadRequired()
				setCurrentUser(values.username)
				const onlineAuthStatus = resp.status === 'SUCCESS'
				const offlineAuthStatus = testPassword(values.username, values.password)
				localUserStore.username = values.username
				setCurrentUser(values.username)
				if (onlineAuthStatus && offlineAuthStatus) {
					localUserStore.sessionPassword = CryptoJS.SHA512(values.password).toString(
						CryptoJS.enc.Hex
					)
					logger('Online and offline authentication successful!')
				} else if (onlineAuthStatus && !offlineAuthStatus) {
					clearUser(values.username)
					localUserStore.sessionPassword = CryptoJS.SHA512(values.password).toString(
						CryptoJS.enc.Hex
					)
					checkSalt(values.username) // will create new salt if none found
					setPwdHash(values.username, values.password)
					localforage
						.removeItem(values.username.concat(APOLLO_KEY))
						.then(() => logger(`Apollo persistent storage has been cleared.`))
					logger('Password seems to have changed, clearing stored encrypted data.')
				} else if (!onlineAuthStatus && offlineAuthStatus) {
					localUserStore.sessionPassword = CryptoJS.SHA512(values.username).toString(
						CryptoJS.enc.Hex
					)
					logger(
						'Handle offline auth success: WIP/TBD, need to check offline status and data availability'
					)
				} else if (!onlineAuthStatus && !offlineAuthStatus) {
					logger('Handle offline login failure: WIP/TBD, limited retry?')
				} else {
					logger('Durable cache authentication problem.')
				}
			}

			onLoginClick(resp.status)
		},
		[login, onLoginClick, isDurableCacheEnabled, localUserStore]
	)
	const handlePasswordResetClick = useNavCallback(ApplicationRoute.PasswordReset)

	return (
		<>
			<Row className='mb-5'>
				<h2>{t('login.title')}</h2>
			</Row>
			<Row>
				<Checkbox
					className='mb-5 btnConsent'
					key={'user-sign-in-agreement'}
					label={t('login.agreement')}
					onChange={(e, checked) => {
						setAcceptedAgreement(checked)
					}}
				/>
			</Row>
			<Row>
				<Formik
					initialValues={{
						username: '',
						password: ''
					}}
					onSubmit={handleLoginClick}
				>
					{() => {
						return (
							<Form>
								<FormSectionTitle className='mb-3'>
									<>
										{t('login.emailText')} <span className='text-danger'>*</span>
									</>
								</FormSectionTitle>
								<FormikField
									disabled={!acceptedAgreement}
									name='username'
									placeholder={t('login.emailPlaceholder')}
									className={cx('mb-5', styles.formField, 'loginUsername')}
								/>
								<FormSectionTitle className='mb-3'>
									<>
										{t('login.passwordText')} <span className='text-danger'>*</span>
									</>
								</FormSectionTitle>
								<FormikField
									disabled={!acceptedAgreement}
									name='password'
									placeholder={t('login.passwordPlaceholder')}
									className={cx('mb-3', styles.formField, 'loginPassword')}
									type='password'
								/>
								<Col className='mb-3 ms-1'>
									<span className={styles.forgotPasswordLink} onClick={handlePasswordResetClick}>
										{t('login.forgotPasswordText')}
									</span>
								</Col>
								{error && <div className='mb-2 ps-1 text-danger'>{error}</div>}
								<button
									type='submit'
									className={cx(styles.loginButton, 'btn btn-primary btnLogin')}
									disabled={!acceptedAgreement}
								>
									{t('login.title')}
								</button>
							</Form>
						)
					}}
				</Formik>
			</Row>
		</>
	)
})
