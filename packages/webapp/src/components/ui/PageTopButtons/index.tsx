/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import Icon from '~ui/Icon'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import useWindowSize from '~hooks/useWindowSize'

export interface IPageTopButtons {
	title: string
	buttonName: string
	iconName?: string
	iconClassName?: string
	className?: string
	testId: string
	onButtonClick?: () => void
}

interface PageTopButtonsProps extends ComponentProps {
	buttons: IPageTopButtons[]
}

const PageTopButtons = memo(function PageTopButtons({
	className,
	buttons
}: PageTopButtonsProps): JSX.Element {
	const { isMD } = useWindowSize()

	return (
		<Row className={cx(styles.buttonsWrapper, className)}>
			{buttons?.map((button, index) => {
				return (
					<Col
						key={index}
						className={cx(
							!isMD ? 'col-4 g-0 d-flex justify-content-center' : 'g-0',
							styles.buttonContainer,
							button.className
						)}
					>
						{isMD && <h2>{button.title}</h2>}
						<button data-testid={button.testId} onClick={() => button.onButtonClick?.()}>
							<span>{button.buttonName}</span>
							{button?.iconName && (
								<Icon
									iconName={button.iconName}
									className={cx(styles.buttonIcon, button.iconClassName)}
								/>
							)}
						</button>
					</Col>
				)
			})}
			{isMD && <Col></Col>}
		</Row>
	)
})
export default PageTopButtons
