/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact, Organization } from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { empty } from '~utils/noop'

export function useContactList(): Contact[] {
	const [organization] = useRecoilState<Organization | null>(organizationState)
	return organization?.contacts || empty
}
