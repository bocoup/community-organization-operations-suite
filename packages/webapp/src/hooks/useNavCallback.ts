/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import type { ApplicationRoute } from '~types/ApplicationRoute'
import { navigate } from '~utils/navigate'

/**
 * useNavCallback is a hook that returns a callback that can be used to navigate
 *
 * @param path The path to navigate to. null = current path.
 * @param queryArgs The query arguments to apply
 * @returns A callback to use that executes the navigation.
 */
export function useNavCallback(path: ApplicationRoute | null, queryArgs?: Record<string, any>) {
	const history = useHistory()
	return useCallback(() => {
		navigate(history, path, queryArgs)
	}, [history, path, queryArgs])
}
