/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import type { Mention } from '@cbosuite/schema/lib/client-types'
import formatTimeFromToday from '~utils/formatTimeFromToday'
import { memo, Fragment } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import Icon from '~ui/Icon'
import ShortString from '~ui/ShortString'

interface NotificationRowProps extends ComponentProps {
	mention: Mention
	clickCallback?: () => void
	dismissCallback?: () => void
}

const NotificationRow = memo(function NotificationRow({
	mention,
	clickCallback,
	dismissCallback
}: NotificationRowProps): JSX.Element {
	const { c } = useTranslation()

	const getNotificationItemBody = (): (string | JSX.Element)[] => {
		const content = []
		const words = c('notification.row.text').split(' ')
		let isLastWordaPlaceholder = false
		for (let i = 0; i < words.length; i++) {
			if (words[i] === '[[sender]]') {
				content.push(
					<Fragment key={i}>
						<span className='text-primary'>
							{mention?.createdBy?.name.first} {mention?.createdBy?.name.last}
						</span>{' '}
					</Fragment>
				)
				isLastWordaPlaceholder = true
				continue
			}

			if (words[i] === '[[description]]') {
				content.push(
					<Fragment key={i}>
						<span className={styles.description}>
							<ShortString
								text={mention?.engagement?.description}
								limit={30}
								showReadMoreLess={false}
							/>
						</span>{' '}
					</Fragment>
				)
				isLastWordaPlaceholder = true
				continue
			}

			if (isLastWordaPlaceholder) {
				content.push(`${words[i]} `)
				isLastWordaPlaceholder = false
			} else {
				content[content.length - 1] = content[content.length - 1] + `${words[i]} `
			}
		}

		return content
	}

	const dismissItem = ev => {
		dismissCallback?.()
		ev.stopPropagation()
	}

	return (
		<div
			className={cx(styles.notificationRow, !mention.seen && styles.unRead)}
			onClick={() => clickCallback?.()}
		>
			<div className='text-dark mb-2'>{formatTimeFromToday(mention.createdAt)}</div>
			<Icon className={styles.dismissIcon} iconName='Cancel' onClick={ev => dismissItem(ev)} />
			{mention?.createdBy ? (
				<>
					<div className='mb-2'>{getNotificationItemBody()}</div>
					{mention?.message && (
						<div className={cx('mb-3', styles.comment)}>&ldquo;{mention.message}&rdquo;</div>
					)}
				</>
			) : (
				c('notification.row.defaultText')
			)}
		</div>
	)
})
export default NotificationRow
