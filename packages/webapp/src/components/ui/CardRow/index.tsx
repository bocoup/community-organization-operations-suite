/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DetailsRow, IDetailsRowProps } from '@fluentui/react'
import cx from 'classnames'
import styles from './index.module.scss'
import { useWindowSize } from '~hooks/useWindowSize'
import { ComponentProps } from '~types/ComponentProps'
import { CardRowFooter } from '~ui/CardRowFooter'
import { CardRowTitle } from '~ui/CardRowTitle'
import { ShortString } from '~ui/ShortString'
import { getItemFieldValue } from '~utils/getItemFieldValue'
import { FC, memo } from 'react'

export interface CardRowProps extends ComponentProps {
	item?: IDetailsRowProps
	title?: string
	layout?: Record<string, unknown>
	titleLink?: string
	body?: string | JSX.Element
	bodyLimit?: number
	mb?: boolean
	footNotes?: string[] | JSX.Element[]
	// TODO: define actions
	actions?: (() => void)[]
	onClick?: () => void
}

/**
 * A responsive Row that turns into a Card!
 *
 * @param param0
 * @returns CardRow should ONLY be used in ~ui/DetailsList
 */
export const CardRow: FC<CardRowProps> = memo(function CardRow({
	item,
	title,
	titleLink,
	body,
	bodyLimit,
	mb = true,
	footNotes,
	actions,
	onClick
}) {
	const { isLG } = useWindowSize()
	const header = getItemFieldValue(title, item) || title
	const bodyIsString = typeof body === 'string'
	const _body = bodyIsString ? getItemFieldValue(body as string, item) || body : body

	if (isLG) {
		return <DetailsRow {...item} />
	} else {
		return (
			<div className={cx(styles.cardRow, 'p-3', mb && 'mb-3')}>
				<CardRowTitle title={header} titleLink={titleLink} onClick={() => onClick?.()} />
				{bodyIsString ? <ShortString text={_body as string} limit={bodyLimit} /> : _body}

				<CardRowFooter footNotes={footNotes} actions={actions} item={item} />
			</div>
		)
	}
})
