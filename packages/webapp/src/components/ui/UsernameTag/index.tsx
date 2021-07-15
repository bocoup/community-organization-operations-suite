/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { useRouter } from 'next/router'

interface UsernameTagProps extends ComponentProps {
	userId: string
	userName: string
	identifier: string
}

const UsernameTag = memo(function UsernameTag({
	userId,
	userName,
	identifier
}: UsernameTagProps): JSX.Element {
	const router = useRouter()

	const handleUserNameRoute = useCallback(() => {
		router.push(`${router.pathname}?${identifier}=${userId}`, undefined, { shallow: true })
	}, [router, identifier, userId])

	return (
		<span role='button' className='text-primary p-0' onClick={() => handleUserNameRoute()}>
			@{userName}
		</span>
	)
})
export default UsernameTag
