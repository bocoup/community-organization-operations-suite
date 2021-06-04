/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import { useEffect, useState } from 'react'

type ClientOnlyProps = ComponentProps

export default function ClientOnly({ children, ...delegated }: ClientOnlyProps): JSX.Element {
	const [hasMounted, setHasMounted] = useState(false)

	useEffect(() => {
		setHasMounted(true)
	}, [])

	if (!hasMounted) {
		return null
	}

	return <div {...delegated}>{children}</div>
}
