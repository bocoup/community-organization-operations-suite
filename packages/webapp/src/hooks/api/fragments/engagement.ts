/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql } from '@apollo/client'

export const EngagementFields = gql`
	fragment EngagementFields on Engagement {
		id
		orgId
		description
		status
		startDate
		endDate
		user {
			id
		}
		# tags {
		# 	...TagFields
		# }
		# contact {
		# 	...ContactFields
		# }
		# actions {
		# 	...ActionFields
		# }
	}
`
