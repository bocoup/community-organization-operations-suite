/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql } from '@apollo/client'

export const UserFields = gql`
	fragment UserFields on User {
		id
		userName
		name {
			first
			middle
			last
		}
	}
`
