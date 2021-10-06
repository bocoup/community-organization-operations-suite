/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import React, { FC, memo, useCallback } from 'react'
import { TextField } from '@fluentui/react'
import { Col, Row } from 'react-bootstrap'
import { Collapsible } from '~ui/Collapsible'
import { ReactSelect } from '~ui/ReactSelect'
import { searchFieldStyles, searchFieldIconProps } from './styles'
import { FilterOptions } from './types'
import { useTranslation } from '~hooks/useTranslation'
import { emptyStr } from '~utils/noop'

export const ListSearch: FC<{
	collapsible: boolean
	collapsibleOpen: boolean
	filterOptions?: FilterOptions
	showSearch: boolean
	onSearchChange: (value: string) => void
}> = memo(function ListSearch({
	collapsible,
	collapsibleOpen,
	filterOptions,
	showSearch,
	onSearchChange
}) {
	const { c } = useTranslation()
	const handleSearchChange = useCallback(
		(_ev: React.FormEvent, searchVal?: string) => {
			onSearchChange(searchVal || emptyStr)
		},
		[onSearchChange]
	)
	return (
		<Col md={6} xs={12}>
			<Collapsible enabled={collapsible} in={collapsibleOpen}>
				<Row>
					{filterOptions && (
						<Col md={6} xs={12} className='mb-3 mb-md-0'>
							<ReactSelect {...filterOptions} />
						</Col>
					)}
					<Col md={6} xs={12}>
						{showSearch && (
							<TextField
								placeholder={c('paginatedList.search')}
								onChange={handleSearchChange}
								styles={searchFieldStyles}
								iconProps={searchFieldIconProps}
							/>
						)}
					</Col>
				</Row>
			</Collapsible>
		</Col>
	)
})
