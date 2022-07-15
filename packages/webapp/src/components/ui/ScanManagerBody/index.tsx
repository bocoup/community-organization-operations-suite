/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { memo } from 'react'
import { ScanOcrDemo } from '~components/ui/ScanOcrDemo'

interface ScanManagerBodyProps {
	onClose?: () => void
	isLoaded?: (loaded: boolean) => void
}

export const ScanManagerBody: StandardFC<ScanManagerBodyProps> = memo(
	function ScanFormPanelBody({}) {
		return <ScanOcrDemo />
	}
)
