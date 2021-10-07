/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import { memo } from 'react'
import type { StandardFC } from '~types/StandardFC'
import cx from 'classnames'
import { useNavCallback } from '~hooks/useNavCallback'

interface UsernameTagProps {
	userId: string
	userName: string
	identifier: string
}

export const UsernameTag: StandardFC<UsernameTagProps> = memo(function UsernameTag({
	userId,
	userName,
	identifier,
	className
}) {
	const onClick = useNavCallback(null, { [identifier]: userId })
	return (
		<span className={cx(styles.link, className)} onClick={onClick}>
			@{userName}
		</span>
	)
})
