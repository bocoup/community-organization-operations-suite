/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import Icon from '~ui/Icon'
import cx from 'classnames'
import ClientOnly from '../ClientOnly'

export interface IPageTopButtons {
	title: string
	buttonName: string
	iconName?: string
	iconClassName?: string
	className?: string
	onButtonClick?: () => void
}

interface PageTopButtonsProps extends ComponentProps {
	buttons: IPageTopButtons[]
}

const PageTopButtons = memo(function PageTopButtons({
	className,
	buttons
}: PageTopButtonsProps): JSX.Element {
	return (
		<ClientOnly>
			<div className={cx(styles.buttonsWrapper, className)}>
				{buttons?.map((button, index) => {
					return (
						<div key={index} className={cx(styles.buttonContainer, button.className)}>
							<h2>{button.title}</h2>
							<button onClick={() => button.onButtonClick?.()}>
								<span>{button.buttonName}</span>
								{button?.iconName && (
									<Icon
										iconName={button.iconName}
										className={cx(styles.buttonIcon, button.iconClassName)}
									/>
								)}
							</button>
						</div>
					)
				})}
			</div>
		</ClientOnly>
	)
})
export default PageTopButtons
