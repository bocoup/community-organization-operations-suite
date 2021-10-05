/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Tag, TagCategory } from '@cbosuite/schema/dist/client-types'
import { FormikAsyncSelect, OptionType, FormikAsyncSelectProps } from '~ui/FormikAsyncSelect'

import { useOrganization } from '~hooks/api/useOrganization'
import { memo } from 'react'
import { TAG_CATEGORIES } from '~constants'
import { useTranslation } from '~hooks/useTranslation'
import { StandardFC } from '~types/StandardFC'

interface GroupedOption {
	label: string
	options: OptionType[]
}

interface TagSelectProps extends FormikAsyncSelectProps {
	name?: string
	placeholder?: string
	disabled?: boolean
	error?: string
}

const transformTag = (tag: Tag): OptionType => {
	return {
		label: tag.label,
		value: tag.id.toString()
	}
}

export const TagSelect: StandardFC<TagSelectProps> = memo(function TagSelect({
	name,
	placeholder,
	disabled
}) {
	const { organization } = useOrganization()
	const { c } = useTranslation()

	const transformTags = (
		categories: TagCategory[],
		tags: Tag[] = [],
		filter?: string
	): GroupedOption[] => {
		// Initial filtering of tags from search
		const _tags = filter
			? tags.filter((i) => i.label.toLowerCase().includes(filter.toLowerCase()))
			: tags

		// Group tags
		const groupedTags = categories.map((tagCategory) => {
			// Filter category
			let options: OptionType[] | Tag[] = _tags.filter((t) => t.category === tagCategory)

			// Include uncategorized tags as other
			if (tagCategory === 'OTHER')
				options = _tags.filter((t) => !t.category || t.category === tagCategory)

			// Map tags to OptionType and sort them
			options =
				options
					.map(transformTag)
					.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1)) || []

			return {
				label: c(`tagCategory.${tagCategory}`),
				options: options as OptionType[]
			}
		})

		return groupedTags
	}

	const groupedOptions = transformTags(TAG_CATEGORIES, organization?.tags)

	const filterTags = (inputValue: string): GroupedOption[] => {
		return transformTags(TAG_CATEGORIES, organization?.tags, inputValue)
	}

	const loadOptions = (inputValue: string, callback: (response: GroupedOption[]) => void) => {
		callback(filterTags(inputValue))
	}

	return (
		<FormikAsyncSelect
			disabled={disabled}
			isMulti
			name={name}
			defaultOptions={groupedOptions}
			loadOptions={loadOptions}
			placeholder={placeholder}
		/>
	)
})
