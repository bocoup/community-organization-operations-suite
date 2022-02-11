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
	const { t } = useTranslation(Namespace.Footer)
	const classname = useWindowSize().isLessThanLG ? styles.footerMobile : styles.footer

	const links = [
		!!constants.privacyUrl && (
			<a key='privacy' href={constants.privacyUrl} rel='noreferrer'>
				{t('footerBar.privacyAndCookies')}
			</a>
		),
		!!constants.trademarksUrl && (
			<a key='trademarks' href={constants.trademarksUrl} rel='noreferrer'>
				{t('footerBar.trademarks')}
			</a>
		),
		!!constants.termsOfUseUrl && (
			<a key='termsofuse' href={constants.termsOfUseUrl} rel='noreferrer'>
				{t('footerBar.termsOfUse')}
			</a>
		),
		!!constants.contactUsEmail && (
			<a key='contactus' href={`mailto:${constants.contactUsEmail}`} rel='noreferrer'>
				{t('footerBar.contactUs')}
			</a>
		),
		!!constants.codeOfConductUrl && (
			<a key='codeofconduct' href={constants.codeOfConductUrl} rel='noreferrer'>
				{t('footerBar.codeOfConduct')}
			</a>
		),
		constants.copyright && <span key='copyright'>{constants.copyright}</span>
	].filter((link) => !!link)

	return <footer className={classname}>{links}</footer>
})
