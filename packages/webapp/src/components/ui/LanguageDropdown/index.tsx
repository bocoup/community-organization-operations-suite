/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type ComponentProps from '~types/ComponentProps'
import { Dropdown } from '@fluentui/react'
import ClientOnly from '~ui/ClientOnly'
import cx from 'classnames'
import { useTranslation } from '~hooks/useTranslation'

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
				styles={{
					root: {
						marginRight: 20
					},
					dropdown: {
						fontSize: 12,
						border: 'none',
						selectors: {
							':focus': {
								'.ms-Dropdown-title': {
									color: 'white'
								},
								'.ms-Dropdown-caretDown': {
									color: 'white'
								}
							},
							':hover': {
								'.ms-Dropdown-title': {
									color: 'white'
								},
								'.ms-Dropdown-caretDown': {
									color: 'white'
								}
							},
							':active': {
								'.ms-Dropdown-title': {
									color: 'white'
								},
								'.ms-Dropdown-caretDown': {
									color: 'white'
								}
							}
						}
					},
					title: {
						backgroundColor: 'transparent',
						color: 'white',
						border: 'none',
						outline: 'none'
					},
					caretDown: {
						color: 'white'
					},
					dropdownItem: {
						fontSize: 12
					},
					dropdownItemSelected: {
						fontSize: 12
					},
					dropdownItemSelectedAndDisabled: {
						fontSize: 12
					}
				}}
			/>
		</ClientOnly>
	)
})
export default LanguageDropdown
