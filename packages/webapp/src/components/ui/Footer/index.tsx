/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, FC } from 'react'
import classnames from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { useTranslation } from '~hooks/useTranslation'
import { features, constants } from '~utils/features'

type FooterProps = ComponentProps

const Footer = memo(function Footer(_props: FooterProps): JSX.Element {
	const { t } = useTranslation('footer')

	return (
		<>
			{features.pilotFeedbackLink ? <PilotLink /> : null}
			<div className={styles.footer}>
				<Link href={constants.privacyUrl}>{t('footerBar.privacyAndCookies')}</Link>
				{' | '}
				<Link href={constants.trademarksUrl}>{t('footerBar.trademarks')}</Link>
				{' | '}
				<Link href={constants.termsOfUseUrl}>{t('footerBar.termsOfUse')}</Link>
				{' | '}
				<Link href={`mailto:${constants.contactUsEmail}`}>{t('footerBar.contactUs')}</Link>
				{' | '}
				<Link href={constants.codeOfConductUrl}>{t('footerBar.codeOfConduct')}</Link>
				{' | '}
				<Link>{constants.copyright}</Link>
			</div>
		</>
	)
})
export default Footer

const Link: FC<{
	href?: string
	className?: string
	style?: React.CSSProperties
}> = memo(function Link({ className, children, href, style }) {
	const finalClassName = classnames(styles.link, { className })

	return href == null ? (
		<div style={style} className={finalClassName}>
			{children}
		</div>
	) : (
		<a target='_blank' rel='noreferrer' href={href} style={style} className={finalClassName}>
			{children}
		</a>
	)
})

function PilotLink() {
	const { t } = useTranslation('footer')
	return (
		<div className={styles.pilotLinkWrapper}>
			{t('sendFeedback.title')}
			<Link href='mailto:intakeprototype@googlegroups.com'>
				<span className={styles.pilotContactEmail}>{constants.pilotFeedbackEmail}</span>
			</Link>
		</div>
	)
}
