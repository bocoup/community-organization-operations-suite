/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import type { StandardFC } from '~types/StandardFC'
import { formatTimeFromToday } from '~utils/formatTimeFromToday'
import type { Action } from '@cbosuite/schema/dist/client-types'
import { ShortString } from '../ShortString'
import styles from './index.module.scss'
import { TagList } from '~components/lists/TagList'
import { MentionBadge } from '~ui/MentionBadge'
import { memo } from 'react'
import { UsernameTag } from '~ui/UsernameTag'

interface RequestActionHistoryItemProps {
	requestAction: Action
}

export const RequestActionHistoryItem: StandardFC<RequestActionHistoryItemProps> = memo(
	function RequestActionHistoryItem({ requestAction, className }) {
		if (!requestAction) {
			return null
		}
		const { date, user, comment, tags, taggedUser } = requestAction
		const taggedUserIsNotUser = taggedUser && taggedUser.id !== user.id
		const hasTags = !!tags && tags.length > 0

		return (
			<div className={cx('mb-3 p-2 py-3', styles.requestActionHistoryItem, className)}>
				<div className='text-dark mb-2'>{formatTimeFromToday(date)}</div>
				<div>
					<div className='mb-3'>
						{/* TODO: change link to specialist */}
						<UsernameTag userId={user.id} userName={user.userName} identifier='specialist' />{' '}
						<ShortString limit={120} text={comment} />
					</div>

					{hasTags && <TagList tags={tags} />}
					{taggedUserIsNotUser && (
						<MentionBadge light={true}>
							<UsernameTag
								userId={taggedUser.id}
								userName={taggedUser.userName}
								identifier='specialist'
								className={styles.mentionTaggedUser}
							/>
						</MentionBadge>
					)}
				</div>
			</div>
		)
	}
)
