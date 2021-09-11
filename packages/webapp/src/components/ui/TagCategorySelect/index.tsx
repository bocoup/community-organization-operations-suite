/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TagCategory } from '@cbosuite/schema/dist/client-types'
import FormikSelect, { OptionType } from '~ui/FormikSelect'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import CP from '~types/ComponentProps'

interface TagCategorySelectProps extends CP {
	name?: string
	placeholder?: string
	error?: string
	categories?: string[]
	defaultValue?: string
}

const TAG_CATEGORIES: TagCategory[] = [
	TagCategory.Other,
	TagCategory.Sdoh,
	TagCategory.Grant,
	TagCategory.Program
]

const TagCategorySelect = memo(function TagCategorySelect({
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
export default TagCategorySelect
