/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import { Col } from 'react-bootstrap'
import { IconButton } from '~ui/IconButton'
import { Collapsible } from '~ui/Collapsible'

export const ActionButtons: FC<{
	addButtonName?: string
	exportButtonName?: string
	collapsible: boolean
	collapsibleOpen: boolean
	onAdd: () => void
	onExport: () => void
}> = memo(function ExportButton({
	addButtonName,
	exportButtonName,
	collapsible,
	collapsibleOpen,
	onAdd,
	onExport
}) {
	return (
		<Col xs={3} className='d-flex justify-content-end'>
			<Collapsible enabled={collapsible} in={collapsibleOpen}>
				<>
					{exportButtonName && (
						<IconButton icon='DrillDownSolid' text={exportButtonName} onClick={onExport} />
					)}
					{addButtonName && (
						<IconButton
							icon='CircleAdditionSolid'
							text={addButtonName}
							className='btnAddItem'
							onClick={onAdd}
						/>
					)}
				</>
			</Collapsible>
		</Col>
	)
})
