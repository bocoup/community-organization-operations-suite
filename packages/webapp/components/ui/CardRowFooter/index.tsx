/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsRowProps } from '@fluentui/react'
import cx from 'classnames'
import { isValidElement } from 'react'
import type ComponentProps from '~types/ComponentProps'
import CardRowFooterItem from '~ui/CardRowFooterItem'
import MultiActionButton from '~ui/MultiActionButton'
import getItemFieldValue from '~utils/getItemFieldValue'
import getItemHeader from '~utils/getItemHeader'

interface CardRowFooterProps extends ComponentProps {
	title?: string
	item?: IDetailsRowProps
	footNotes?: string[] | JSX.Element[]
	// TODO: define actions
	actions?: (() => void)[]
}

export default function CardRowFooter({
	footNotes,
	actions,
	item
}: CardRowFooterProps): JSX.Element {
	return (
		<div className={cx('d-flex flex-column flex-sm-row justify-content-between align-items-end')}>
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
						console.log('item clicked', item)
					}}
				/>
			)}
		</div>
	)
}
