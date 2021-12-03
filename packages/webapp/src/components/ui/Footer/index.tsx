/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, FC, CSSProperties } from 'react'
import classnames from 'classnames'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { constants } from '~utils/features'
import { useWindowSize } from '~hooks/useWindowSize'

export const Footer: StandardFC = memo(function Footer(_props) {
	const dims = useWindowSize()
	return dims.isLessThanLG ? <FooterMobile /> : <FooterDesktop />
})

function FooterMobile() {
	return (
		<>
			<div className={styles.footerMobile}>
				<FooterLinks />
			</div>
		</>
	)
}

function FooterDesktop() {
	return (
		<div className={styles.footerContainer}>
			<div className={styles.footer}>
				<FooterLinks join={' | '} />
			</div>
		</div>
	)
}

const FooterLinks: FC<{ join?: string }> = memo(function FooterLinks({ join }) {
	const { t } = useTranslation(Namespace.Footer)
	const links = [
		constants.privacyUrl ? (
			<Link key='privacy' href={constants.privacyUrl}>
				{t('footerBar.privacyAndCookies')}
			</Link>
		) : null,
		constants.trademarksUrl ? (
			<Link key='trademarks' href={constants.trademarksUrl}>
				{t('footerBar.trademarks')}
			</Link>
		) : null,
		constants.termsOfUseUrl ? (
			<Link key='termsofuse' href={constants.termsOfUseUrl}>
				{t('footerBar.termsOfUse')}
			</Link>
		) : null,
		constants.contactUsEmail ? (
			<Link key='contactus' href={`mailto:${constants.contactUsEmail}`}>
				{t('footerBar.contactUs')}
			</Link>
		) : null,
		constants.codeOfConductUrl ? (
			<Link key='codeofconduct' href={constants.codeOfConductUrl}>
				{t('footerBar.codeOfConduct')}
			</Link>
		) : null,
		constants.copyright ? <Link key='copyright'>{constants.copyright}</Link> : null
	].filter((t) => !!t)
	const elements: Array<JSX.Element | string> = []
	for (let i = 0; i < links.length; i++) {
		elements.push(links[i])
		if (i < links.length - 1) {
			elements.push(join)
		}
	}
	return <>{elements}</>
})

const Link: FC<{
	href?: string
	className?: string
	style?: CSSProperties
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
