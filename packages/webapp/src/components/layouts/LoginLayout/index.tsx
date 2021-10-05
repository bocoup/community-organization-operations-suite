/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type { ComponentProps } from '~types/ComponentProps'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import { Footer } from '~components/ui/Footer'

interface LoginLayoutProps extends ComponentProps {
	title?: string
}

export const LoginLayout = wrap(
	memo(function LoginLayout({ children }: LoginLayoutProps): JSX.Element {
		const { t } = useTranslation('login')
		const title = t('pageTitle')
		return (
			<>
				<Title title={title} />
				<div className={styles.root}>
					{children}
					<Footer />
				</div>
			</>
		)
	})
)
