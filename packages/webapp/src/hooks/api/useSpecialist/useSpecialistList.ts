/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Organization, User } from '@cbosuite/schema/dist/client-types'
import { useRecoilState } from 'recoil'
import { organizationState } from '~store'
import { empty } from '~utils/noop'

export function useSpecialistList(): User[] {
	const [organization] = useRecoilState<Organization | null>(organizationState)
	return organization?.users || empty
}
