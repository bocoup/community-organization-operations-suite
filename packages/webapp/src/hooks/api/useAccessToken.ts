/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useRecoilValue } from 'recoil'
import { userAuthResponseState } from '~store'
import { AuthResponse } from '.'

export function useAccessToken() {
	const authUser = useRecoilValue<AuthResponse | null>(userAuthResponseState)
	return authUser?.accessToken
}
