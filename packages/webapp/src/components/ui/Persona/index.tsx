/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContextualMenu, Persona, PersonaSize, Stack } from '@fluentui/react'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from './index.module.scss'
import { getAuthUser, logoutUser } from '~slices/authSlice'
import ComponentProps from '~types/ComponentProps'

export default function CustomPersona({ className }: ComponentProps): JSX.Element {
	const auth = useSelector(getAuthUser)
	const dispatch = useDispatch()
	const [personaMenuOpen, setPersonaMenuOpen] = useState(false)
	const personaComponent = useRef(null)
	const router = useRouter()

	if (!auth.user?.data) return null

	const { firstName } = auth.user.data

	return (
		<div className={className}>
			<div
				onClick={() => setPersonaMenuOpen(true)}
				className={cx(style.persona, 'd-flex align-items-center')}
			>
				<Stack className='d-flex align-items-center' horizontal tokens={{ childrenGap: 8 }}>
					<div className='pr-3'>Hello, {firstName}</div>
					<Persona
						ref={personaComponent}
						text={firstName}
						size={PersonaSize.size32}
						hidePersonaDetails={true}
					/>
				</Stack>
			</div>
			<ContextualMenu
				items={[
					{
						key: 'viewAccount',
						text: 'Account',
						onClick: () => router.push('/account')
					},
					{
						key: 'logoutUserPersonaMenu',
						text: 'Logout',
						onClick: () => {
							dispatch(logoutUser())
						}
					}
				]}
				hidden={!personaMenuOpen}
				target={personaComponent}
				onItemClick={() => setPersonaMenuOpen(false)}
				onDismiss={() => setPersonaMenuOpen(false)}
			/>
		</div>
	)
}
