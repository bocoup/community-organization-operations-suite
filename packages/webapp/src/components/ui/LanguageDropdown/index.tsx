/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CSSProperties, FC } from 'react'
import { memo, useCallback, useMemo } from 'react'
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown, FontIcon } from '@fluentui/react'
import cx from 'classnames'
import { useTranslation } from '~hooks/useTranslation'
import { useWindowSize } from '~hooks/useWindowSize'
import { LOCALES, useLocale } from '~hooks/useLocale'

export const LanguageDropdown: FC<{ className?: string }> = memo(function LanguageDropdown({
	className
}) {
	const { c } = useTranslation()
	const { isLessThanSM } = useWindowSize()
	const [locale, setLocale] = useLocale()
	const localeOptions = useLocaleOptions()
	const dropdownStyle = useDropdownStyle()
	const handleChange = useCallback(
		(_ev, option: IDropdownOption) => {
			setLocale(option.key as string)
		},
		[setLocale]
	)

	return (
		<Dropdown
			id='languageDropdown'
			options={localeOptions}
			selectedKey={locale}
			role='button'
			ariaLabel={c('languageDropdownAriaLabel')}
			onChange={handleChange}
			className={cx(className)}
			onRenderCaretDown={
				isLessThanSM
					? () => <FontIcon iconName='LocaleLanguage' style={caretDownStyle} />
					: undefined
			}
			styles={dropdownStyle}
		/>
	)
})

function useLocaleOptions() {
	return useMemo<IDropdownOption[]>(
		() =>
			LOCALES.map((loc) => {
				const languageName = new Intl.DisplayNames([loc], {
					type: 'language'
				})
				return {
					key: loc,
					text: languageName.of(loc)
				}
			}),
		[]
	)
}

function useDropdownStyle() {
	const { isLessThanSM } = useWindowSize()
	return useMemo(
		() => ({
			root: {
				marginRight: isLessThanSM ? 5 : 20
			},
			dropdown: {
				fontSize: 12,
				border: 'none',
				textTransform: 'capitalize'
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
						marginTop: 'var(--action-bar--height)'
					},
					overlay: {
						marginTop: 'var(--action-bar--height)'
					}
				}
			}
		}),
		[isLessThanSM]
	)
}

const caretDownStyle: CSSProperties = { color: 'var(--bs-white)', fontSize: '16px' }
