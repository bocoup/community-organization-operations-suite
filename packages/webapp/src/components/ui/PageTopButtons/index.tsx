/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Icon } from '~ui/Icon'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { useWindowSize } from '~hooks/useWindowSize'
import { empty, noop } from '~utils/noop'

export interface IPageTopButtons {
	title: string
	buttonName: string
	iconName?: string
	iconClassName?: string
	className?: string
	onButtonClick?: () => void
}

interface PageTopButtonsProps {
	buttons?: IPageTopButtons[]
}

export const PageTopButtons: StandardFC<PageTopButtonsProps> = memo(function PageTopButtons({
	className,
	buttons = empty
}) {
	const { isMD } = useWindowSize()

	return (
		<Row className={cx(styles.buttonsWrapper, className)}>
			{buttons.map(
				(
					{ buttonName, onButtonClick = noop, title, className, iconName, iconClassName },
					index
				) => {
					return (
						<Col
							key={index}
							className={cx(
								!isMD ? 'col-4 g-0 d-flex justify-content-center' : 'g-0',
								styles.buttonContainer,
								className
							)}
						>
							{isMD && <h2>{title}</h2>}
							<button onClick={() => onButtonClick()}>
								<span>{buttonName}</span>
								{iconName && (
									<Icon iconName={iconName} className={cx(styles.buttonIcon, iconClassName)} />
								)}
							</button>
						</Col>
					)
				}
			)}
			{isMD && <Col></Col>}
		</Row>
	)
})
