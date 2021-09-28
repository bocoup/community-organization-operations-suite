/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContextualMenu, Persona, PersonaSize } from '@fluentui/react'
import cx from 'classnames'
import { memo, useRef, useState } from 'react'
import style from './index.module.scss'
import ComponentProps from '~types/ComponentProps'
import { useAuthUser } from '~hooks/api/useAuth'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useHistory } from 'react-router-dom'

const CustomPersona = memo(function CustomPersona({ className }: ComponentProps): JSX.Element {
	const history = useHistory()
	const [personaMenuOpen, setPersonaMenuOpen] = useState(false)
	const personaComponent = useRef(null)
	const { logout } = useAuthUser()
	const { currentUser } = useCurrentUser()
	const { c } = useTranslation()

	const firstName = currentUser?.name?.first || ''

	return (
		<div className={className}>
			<div
				onClick={() => setPersonaMenuOpen(true)}
				className={cx(style.persona, 'd-flex align-items-center')}
			>
				{/* TODO: remove stack in favor of styled div component */}
				<div className='d-flex align-items-center justify-content-center'>
					<div className='pr-3 me-3'>{c('personaTitle', { firstName })}</div>
					<>
						<Persona
							ref={personaComponent}
							text={firstName}
							size={PersonaSize.size32}
							hidePersonaDetails
						/>

						<ContextualMenu
							items={[
								{
									key: 'viewAccount',
									text: c('personaMenu.accountText'),
									onClick: () => history.push('/account')
								},
								{
									key: 'logoutUserPersonaMenu',
									text: c('personaMenu.logoutText'),
									onClick: () => {
										history.push('/logout')
										logout()
									}
								}
							]}
							hidden={!personaMenuOpen}
							target={personaComponent}
							onItemClick={() => setPersonaMenuOpen(false)}
							onDismiss={() => setPersonaMenuOpen(false)}
						/>
					</>
				</div>
			</div>
		</div>
	)
})
export default CustomPersona
