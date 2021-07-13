/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Link from 'next/link'
import type ComponentProps from '~types/ComponentProps'
import formatTimeFromToday from '~utils/formatTimeFromToday'
import type { Action } from '@resolve/schema/lib/client-types'
import ShortString from '../ShortString'
import styles from './index.module.scss'
import TagList from '~components/lists/TagList'
import MentionBadge from '~ui/MentionBadge'
import { memo } from 'react'

interface RequestActionHistoryItemProps extends ComponentProps {
	requestAction: Action
}

/**
 * Render message
 *
 * TODO: replace string return swith translations
 */
// const renderMessage = (action: Action, message: string): string | JSX.Element => {
// 	switch (action) {
// 		case Action.Claimed:
// 			return 'claimed this ticket'
// 		case Action.CheckIn:
// 		default:
// 			return message
// 	}
// }

const RequestActionHistoryItem = memo(function RequestActionHistoryItem({
	requestAction,
	className
}: RequestActionHistoryItemProps): JSX.Element {
	if (!requestAction) return null

	const { date, user, comment, tags, taggedUser } = requestAction

	return (
		<div className={cx('mb-3 p-2 py-3', styles.requestActionHistoryItem, className)}>
			<div className='text-muted mb-2'>{formatTimeFromToday(date)}</div>
			<div>
				<div className='mb-3'>
					{/* TODO: change link to specialist */}
					<Link href={`/specialist/${user.id}`}>
						<a>@{user.userName}:</a>
					</Link>{' '}
					<ShortString limit={120} text={comment} />
				</div>

				{tags && <TagList tags={tags} />}
				{taggedUser && (
					<MentionBadge className='bg-gray1'>
						<>@{taggedUser.userName}</>
					</MentionBadge>
				)}
			</div>
		</div>
	)
})
export default RequestActionHistoryItem
