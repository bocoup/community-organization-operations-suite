/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Link from 'next/link'
import type ComponentProps from '~types/ComponentProps'
import RequestAction, { Action } from '~types/RequestAction'
import formatTimeFromToday from '~utils/formatTimeFromToday'

interface RequestActionHistoryItemProps extends ComponentProps {
	requestAction: RequestAction
}

/**
 * Render message
 *
 * TODO: replace string return swith translations
 */
const renderMessage = (action: Action, message: string): string | JSX.Element => {
	switch (action) {
		case Action.Claimed:
			return 'claimed this ticket'
		case Action.CheckIn:
		default:
			return message
	}
}

export default function RequestActionHistoryItem({
	requestAction,
	className
}: RequestActionHistoryItemProps): JSX.Element {
	const { action, message, createdAt, specialist } = requestAction

	return (
		<div className={cx('mb-3', className)}>
			<div className='text-muted mb-2'>{formatTimeFromToday(createdAt)}:</div>
			<div>
				{/* TODO: change link to specialist */}
				<Link href={`/specialist/${specialist.id}`}>
					<a>@{specialist.userName}:</a>
				</Link>{' '}
				<span>{renderMessage(action, message)}</span>
			</div>
		</div>
	)
}
