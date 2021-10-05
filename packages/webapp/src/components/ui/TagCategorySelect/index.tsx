/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FormikSelect, OptionType } from '~ui/FormikSelect'
import { TAG_CATEGORIES } from '~constants'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { ComponentProps } from '~types/ComponentProps'

interface TagCategorySelectProps extends ComponentProps {
	name?: string
	placeholder?: string
	error?: string
	categories?: string[]
	defaultValue?: string
}

export const TagCategorySelect = memo(function TagCategorySelect({
	name,
	placeholder,
	defaultValue,
	categories,
	className
}: TagCategorySelectProps): JSX.Element {
	const { c, t } = useTranslation('tags')

	const options: OptionType[] = (categories || TAG_CATEGORIES).map((cat) => ({
		label: c(`tagCategory.${cat}`),
		value: cat
	}))

	const defaultSelectValue: OptionType = defaultValue
		? options.find((o) => o.value === defaultValue)
		: undefined

	return (
		<FormikSelect
			name={name}
			defaultValue={defaultSelectValue}
			placeholder={t('tagCategory.select.placeholder')}
			className={className}
			options={options}
		/>
	)
})
