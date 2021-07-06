/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, FC } from 'react'
import classnames from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { useTranslation } from 'next-i18next'
import { features, constants } from '~utils/features'

type FooterProps = ComponentProps

const Footer = memo(function Footer(props: FooterProps): JSX.Element {
	const { t } = useTranslation('footer')

	return (
		<>
			{features.pilotFeedbackLink ? <PilotLink /> : null}
			<div className={styles.footer}>
				<Link href='https://go.microsoft.com/fwlink/?LinkId=521839'>
					{t('footerBar.privacyAndCookies')}
				</Link>
				{' | '}
				<Link href={`mailto:${constants.contactUsEmail}`}>{t('footerBar.contactUs')}</Link>
				{' | '}
				<Link href={constants.codeOfConductUrl}>{t('footerBar.codeOfConduct')}</Link>
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
	return (
		<a
			target='_blank'
			rel='noreferrer'
			href={href}
			style={style}
			className={classnames(styles.link, { className })}
		>
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
