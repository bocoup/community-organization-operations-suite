/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import { Footer } from '~components/ui/Footer'

interface LoginLayoutProps {
	title?: string
}

export const LoginLayout: StandardFC<LoginLayoutProps> = wrap(function LoginLayout({ children }) {
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
