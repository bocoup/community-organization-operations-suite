/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import { memo, useCallback } from 'react'
import type ComponentProps from '~types/ComponentProps'
import cx from 'classnames'
import { useHistory } from 'react-router-dom'

interface UsernameTagProps extends ComponentProps {
	userId: string
	userName: string
	identifier: string
}

const UsernameTag = memo(function UsernameTag({
	userId,
	userName,
	identifier,
	className
}: UsernameTagProps): JSX.Element {
	const history = useHistory()

	const handleUserNameRoute = useCallback(() => {
		history.push(`${history.location.pathname}?${identifier}=${userId}`)
	}, [history, identifier, userId])

	return (
		<span className={cx(styles.link, className)} onClick={() => handleUserNameRoute()}>
			@{userName}
		</span>
	)
})
export default UsernameTag
