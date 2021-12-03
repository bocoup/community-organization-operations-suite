/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsRowProps } from '@fluentui/react'
import cx from 'classnames'
import { isValidElement, memo } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { CardRowFooterItem } from '~ui/CardRowFooterItem'
import { MultiActionButton } from '~ui/MultiActionButton'
import { createLogger } from '~utils/createLogger'
import { getItemFieldValue } from '~utils/getItemFieldValue'
import { getItemHeader } from '~utils/getItemHeader'
const logger = createLogger('CardRowFooter')

interface CardRowFooterProps {
	title?: string
	item?: IDetailsRowProps
	footNotes?: string[] | JSX.Element[]
	// TODO: define actions
	actions?: (() => void)[]
}

export const CardRowFooter: StandardFC<CardRowFooterProps> = memo(function CardRowFooter({
	footNotes,
	actions,
	item
}) {
	return (
		<div className={cx('d-flex flex-row justify-content-between align-items-end')}>
			{footNotes && (
				<div className='d-flex mt-3'>
					{footNotes.map((note, i) =>
						isValidElement(note) ? (
							note
						) : (
							<CardRowFooterItem
								key={i}
								title={getItemHeader(note, item)}
								body={getItemFieldValue(note, item)}
							/>
						)
					)}
				</div>
			)}

			{actions && (
				<MultiActionButton
					className='mt-3 mt-md-0'
					onClick={() => {
						logger('item clicked', item)
					}}
				/>
			)}
		</div>
	)
})
