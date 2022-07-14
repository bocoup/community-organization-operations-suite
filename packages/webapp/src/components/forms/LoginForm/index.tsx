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
import { useRecoilState } from 'recoil'
import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { currentUserState, sessionPasswordState } from '~store'
import type { User } from '@cbosuite/schema/dist/client-types'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { wrap } from '~utils/appinsights'
import { Checkbox } from '@fluentui/react'
import { noop } from '~utils/noop'
import { useNavCallback } from '~hooks/useNavCallback'
import { ApplicationRoute } from '~types/ApplicationRoute'
import {
	getUser,
	testPassword,
	APOLLO_KEY,
	setPreQueueLoadRequired,
	setCurrentUserId
} from '~utils/localCrypto'
import { createLogger } from '~utils/createLogger'
import localforage from 'localforage'
import { config } from '~utils/config'
import { useStore } from 'react-stores'
import { currentUserStore } from '~utils/current-user-store'
import * as CryptoJS from 'crypto-js'
import { StatusType } from '~hooks/api'
import { useOffline } from '~hooks/useOffline'
import { navigate } from '~utils/navigate'
import { OfflineEntityCreationNotice } from '~components/ui/OfflineEntityCreationNotice'
import { UNAUTHENTICATED } from '~api'

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
	const isOffline = useOffline()
	const [, setCurrentUser] = useRecoilState<User | null>(currentUserState)
	const [, setSessionPassword] = useRecoilState(sessionPasswordState)

	const history = useHistory()

	const handleLoginClick = useCallback(
		async (values) => {
			const resp = await login(values.username, values.password)

			if (isDurableCacheEnabled) {
				setPreQueueLoadRequired()
				setCurrentUserId(values.username)
				const onlineAuthStatus = resp.status === 'SUCCESS'
				const offlineAuthStatus = testPassword(values.username, values.password)
				localUserStore.username = values.username
				if (onlineAuthStatus && offlineAuthStatus) {
					// Store session password in react store so we can use it in LocalForageWrapperEncrypted class (recoil hook cannot be used in class)
					// Store the session password in recoil so we can trigger loading and decrypting the cache from persistent storage (see Stateful.tsx)
					localUserStore.sessionPassword = CryptoJS.SHA512(values.password).toString(
						CryptoJS.enc.Hex
					)
					setSessionPassword(localUserStore.sessionPassword)

					logger('Online and offline authentication successful!')
				} else if (onlineAuthStatus && !offlineAuthStatus) {
					// Store session password in react store so we can use it in LocalForageWrapperEncrypted class (recoil hook cannot be used in class)
					// Store the session password in recoil so we can trigger loading and decrypting the cache from persistent storage (see Stateful.tsx)
					localUserStore.sessionPassword = CryptoJS.SHA512(values.password).toString(
						CryptoJS.enc.Hex
					)
					setSessionPassword(localUserStore.sessionPassword)

					localforage
						.removeItem(values.username.concat(APOLLO_KEY))
						.then(() => logger(`Apollo persistent storage has been cleared.`))
					logger('Password seems to have changed, clearing stored encrypted data.')
				} else if (!onlineAuthStatus && offlineAuthStatus && isOffline) {
					// Store session password in react store so we can use it in LocalForageWrapperEncrypted class (recoil hook cannot be used in class)
					// Store the session password in recoil so we can trigger loading and decrypting the cache from persistent storage (see Stateful.tsx)
					localUserStore.sessionPassword = CryptoJS.SHA512(values.password).toString(
						CryptoJS.enc.Hex
					)
					setSessionPassword(localUserStore.sessionPassword)

					const userJsonString = getUser(values.username)
					const user = JSON.parse(userJsonString)
					setCurrentUser(user)
					resp.status = StatusType.Success

					logger('Offline authentication successful')
				} else if (!offlineAuthStatus && isOffline) {
					navigate(history, ApplicationRoute.Login, { error: UNAUTHENTICATED })

					logger('Handle offline login failure: WIP/TBD, limited retry?')
				} else {
					logger('Durable cache authentication problem.')
				}
			}

			onLoginClick(resp.status)
		},
		[
			login,
			onLoginClick,
			isDurableCacheEnabled,
			localUserStore,
			isOffline,
			setCurrentUser,
			history,
			setSessionPassword
		]
	)
	const handlePasswordResetClick = useNavCallback(ApplicationRoute.PasswordReset)

	return (
		<>
			<OfflineEntityCreationNotice isEntityCreation={false} />
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
