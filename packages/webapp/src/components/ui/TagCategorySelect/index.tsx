/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OptionType } from '~ui/FormikSelect'
import { FormikSelect } from '~ui/FormikSelect'
import { TAG_CATEGORIES } from '~constants'
import { memo } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import type { StandardFC } from '~types/StandardFC'

interface TagCategorySelectProps {
	name?: string
	placeholder?: string
	error?: string
	categories?: string[]
	defaultValue?: string
}

export const TagCategorySelect: StandardFC<TagCategorySelectProps> = memo(
	function TagCategorySelect({ name, defaultValue, categories, className }) {
		const { c, t } = useTranslation(Namespace.Tags)

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
	}
)
