/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContextualMenu, ContextualMenuItemType } from '@fluentui/react/lib/ContextualMenu'
import * as React from 'react'
import cx from 'classnames'
import { useState } from 'react'
import styles from './index.module.scss'
import { FontIcon } from '@fluentui/react/lib/Icon'
import { useTranslation } from '~hooks/useTranslation'
import { mergeStyles } from '@fluentui/react/lib/Styling'

export const HelpMenu: React.FunctionComponent = () => {
	const linkRef = React.useRef(null)
	const { c } = useTranslation()
	const [personaMenuOpen, setPersonaMenuOpen] = useState(false)
	return (
		<div onClick={() => setPersonaMenuOpen(true)}>
			<div className={cx(styles.helpMenu)} ref={linkRef}>
				<FontIcon
					aria-label='Help'
					iconName='Help'
					role='img'
					className={mergeStyles({ fontSize: '28px' })}
				/>
			</div>
			<ContextualMenu
				items={[
					{
						key: 'helpArticles',
						text: c('helpMenu.helpArticlesLabel'),
						href: 'http://help.healthycommunityhub.com',
						target: '_blank'
					},
					{
						key: 'divider_1',
						itemType: ContextualMenuItemType.Divider
					},
					{
						key: 'contactSupport',
						text: c('helpMenu.contactSupportLabel'),
						href: 'mailto:help@healthycommunityhub.com',
						target: '_blank'
					}
				]}
				hidden={!personaMenuOpen}
				target={linkRef}
				onItemClick={() => setPersonaMenuOpen(false)}
				onDismiss={() => setPersonaMenuOpen(false)}
			/>
		</div>
	)
}
