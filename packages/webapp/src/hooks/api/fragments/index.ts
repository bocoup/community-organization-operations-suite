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

export const OrgUserFields = gql`
	fragment OrgUserFields on User {
		id
		userName
		email
		phone
		name {
			first
			middle
			last
		}
		address {
			street
			unit
			city
			state
			zip
		}
		roles {
			orgId
			roleType
		}
	}
`

export const ContactFields = gql`
	fragment ContactFields on Contact {
		id
		email
		phone
		dateOfBirth
		address {
			street
			unit
			city
			state
			zip
		}
		name {
			first
			last
		}
	}
`

export const TagFields = gql`
	fragment TagFields on Tag {
		id
		label
	}
`

export const ActionFields = gql`
	${UserFields}
	${TagFields}

	fragment ActionFields on Action {
		user {
			...UserFields
		}
		taggedUser {
			...UserFields
		}
		date
		comment
		tags {
			...TagFields
		}
	}
`

export const EngagementFields = gql`
	${UserFields}
	${TagFields}
	${ContactFields}
	${ActionFields}

	fragment EngagementFields on Engagement {
		id
		orgId
		description
		status
		startDate
		endDate
		user {
			...UserFields
		}
		tags {
			...TagFields
		}
		contact {
			...ContactFields
		}
		actions {
			...ActionFields
		}
	}
`

export const OrgFields = gql`
	${OrgUserFields}
	${ContactFields}
	${TagFields}

	fragment OrgFields on Organization {
		id
		name
		description
		users {
			...OrgUserFields
		}
		contacts {
			...ContactFields
		}
		tags {
			...TagFields
		}
	}
`
