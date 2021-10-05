/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type ComponentProps from '~types/ComponentProps'
import { Dropdown, FontIcon } from '@fluentui/react'
import cx from 'classnames'
import { useTranslation } from '~hooks/useTranslation'
import useWindowSize from '~hooks/useWindowSize'

interface LanguageDropdownProps extends ComponentProps {
	locale: string
	locales: string[]
	onChange?: (locale: string) => void
}

const LanguageDropdown = memo(function LanguageDropdown({
	className,
	locale,
	locales,
	onChange
}: LanguageDropdownProps): JSX.Element {
	const { c } = useTranslation()
	const { isLessThanSM } = useWindowSize()
	const localeOptions = locales.map((loc) => {
		// @ts-expect-error DisplayNames not on Intl
		const languageName = new Intl.DisplayNames([locale], {
			type: 'language'
		})
		return {
			key: loc,
			text: languageName.of(loc)
		}
	})

	return (
		<Dropdown
			id='languageDropdown'
			options={localeOptions}
			defaultSelectedKey={locale}
			role='button'
			ariaLabel={c('languageDropdownAriaLabel')}
			onChange={(_ev, option) => onChange?.(option.key as string)}
			className={cx(className)}
			onRenderCaretDown={
				isLessThanSM
					? () => (
							<FontIcon
								iconName='LocaleLanguage'
								style={{ color: 'var(--bs-white)', fontSize: '16px' }}
							/>
					  )
					: undefined
			}
			onRenderTitle={isLessThanSM ? () => <></> : undefined}
			styles={{
				root: {
					marginRight: isLessThanSM ? 5 : 20
				},
				dropdown: {
					fontSize: 12,
					border: 'none',
					textTransform: 'capitalize',
					selectors: {
						':focus': {
							'.ms-Dropdown-title': {
								color: 'var(--bs-white)'
							},
							'.ms-Dropdown-caretDown': {
								color: 'var(--bs-white)'
							}
						},
						':hover': {
							'.ms-Dropdown-title': {
								color: 'var(--bs-white)'
							},
							'.ms-Dropdown-caretDown': {
								color: 'var(--bs-white)'
							}
						},
						':active': {
							'.ms-Dropdown-title': {
								color: 'var(--bs-white)'
							},
							'.ms-Dropdown-caretDown': {
								color: 'var(--bs-white)'
							}
						}
					}
				},
				title: {
					backgroundColor: 'transparent',
					color: 'var(--bs-white)',
					border: 'none',
					outline: 'none'
				},
				caretDown: {
					color: 'var(--bs-white)'
				},
				dropdownItem: {
					fontSize: 12,
					textTransform: 'capitalize'
				},
				dropdownItemSelected: {
					fontSize: 12,
					textTransform: 'capitalize'
				},
				dropdownItemSelectedAndDisabled: {
					fontSize: 12,
					textTransform: 'capitalize'
				},
				subComponentStyles: {
					panel: {
						main: {
							marginTop: 58
						},
						overlay: {
							marginTop: 58
						}
					}
				}
			}}
		/>
	)
})
export default LanguageDropdown
