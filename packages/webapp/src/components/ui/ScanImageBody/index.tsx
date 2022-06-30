/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { memo } from 'react'
import { ScanImagePanel } from '~components/ui/ScanImagePanel'
import { ScanOcrDemo } from '~components/ui/ScanOcrDemo'

interface ScanImageBodyProps {
	onClose?: () => void
	isLoaded?: (loaded: boolean) => void
}

export const ScanImageBody: StandardFC<ScanImageBodyProps> = memo(function ScanFormPanelBody() {
	// return <ScanImagePanel />
	return <ScanOcrDemo />
})
