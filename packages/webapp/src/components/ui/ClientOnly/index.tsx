/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import { memo, useEffect, useState } from 'react'

type ClientOnlyProps = ComponentProps

const ClientOnly = memo(function ClientOnly({
	children,
	...delegated
}: ClientOnlyProps): JSX.Element {
	const [hasMounted, setHasMounted] = useState(false)

	useEffect(() => {
		setHasMounted(true)
	}, [])

	if (!hasMounted) {
		return null
	}

	return <div {...delegated}>{children}</div>
})
export default ClientOnly
