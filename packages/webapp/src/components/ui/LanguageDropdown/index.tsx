/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type ComponentProps from '~types/ComponentProps'
import { Dropdown, FontIcon } from '@fluentui/react'
import ClientOnly from '~ui/ClientOnly'
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
	const localeOptions = locales.map(loc => {
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
		<ClientOnly>
			<Dropdown
				id='languageDropdown'
				options={localeOptions}
				defaultSelectedKey={locale}
				role='button'
				ariaLabel={c('languageDropdown.ariaLabel')}
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
						fontSize: 12
					},
					dropdownItemSelected: {
						fontSize: 12
					},
					dropdownItemSelectedAndDisabled: {
						fontSize: 12
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
		</ClientOnly>
	)
})
export default LanguageDropdown
