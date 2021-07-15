/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import formatTimeFromToday from '~utils/formatTimeFromToday'
import type { Action } from '@resolve/schema/lib/client-types'
import ShortString from '../ShortString'
import styles from './index.module.scss'
import TagList from '~components/lists/TagList'
import MentionBadge from '~ui/MentionBadge'
import { memo } from 'react'
import UsernameTag from '~ui/UsernameTag'

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

	const taggedUserIsNotUser = taggedUser && taggedUser.id !== user.id

	const hasTags = !!tags && tags.length > 0

	return (
		<div className={cx('mb-3 p-2 py-3', styles.requestActionHistoryItem, className)}>
			<div className='text-muted mb-2'>{formatTimeFromToday(date)}</div>
			<div>
				<div className='mb-3'>
					{/* TODO: change link to specialist */}
					<UsernameTag userId={user.id} userName={user.userName} identifier='specialist' />{' '}
					<ShortString limit={120} text={comment} />
				</div>

				{hasTags && <TagList tags={tags} />}
				{taggedUserIsNotUser && (
					<MentionBadge className='bg-gray1'>
						<UsernameTag
							userId={taggedUser.id}
							userName={taggedUser.userName}
							identifier='specialist'
						/>
					</MentionBadge>
				)}
			</div>
		</div>
	)
})
export default RequestActionHistoryItem
