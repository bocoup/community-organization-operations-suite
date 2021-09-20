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
		roles {
			roleType
			orgId
		}
		email
		phone
	}
`

export const OrgUserFields = gql`
	fragment OrgUserFields on User {
		oid
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
		description
		additionalInfo
		engagementCounts {
			active
			closed
		}
	}
`

export const ContactFields = gql`
	fragment ContactFields on Contact {
		id
		status
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
			middle
			last
		}
		engagements {
			id
			description
			status
			startDate
			endDate
			user {
				id
				userName
				name {
					first
					middle
					last
				}
			}
		}
		tags {
			id
			label
			description
		}
		demographics {
			gender
			genderOther
			ethnicity
			ethnicityOther
			race
			raceOther
			preferredContactMethod
			preferredLanguage
			preferredLanguageOther
			preferredContactTime
		}
	}
`

export const TagFields = gql`
	fragment TagFields on Tag {
		id
		label
		description
		category
		usageCount {
			engagement
			actions
		}
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
export const EngagmentListFields = gql`
	${TagFields}

	fragment EngagmentListFields on Engagement {
		id
		orgId
		title
		description
		status
		startDate
		endDate
		user {
			id
			userName
		}
		tags {
			...TagFields
		}
		contacts {
			id
			name {
				first
				last
			}
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
		title
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
		contacts {
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
export const MentionFields = gql`
	${EngagementFields}
	fragment MentionFields on Mention {
		engagement {
			...EngagementFields
		}
		createdAt
		createdBy {
			id
			userName
			email
			name {
				first
				middle
				last
			}
		}
		message
		seen
		dismissed
	}
`

export const CurrentUserFields = gql`
	${MentionFields}
	fragment CurrentUserFields on User {
		oid
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
		description
		additionalInfo
		engagementCounts {
			active
			closed
		}
		mentions {
			...MentionFields
		}
	}
`

export const ServiceFields = gql`
	${ContactFields}
	fragment ServiceFields on Service {
		id
		name
		description
		orgId
		serviceStatus
		tags {
			id
			label
			description
		}
		customFields {
			fieldId
			fieldName
			fieldType
			fieldRequirements
			fieldValue {
				id
				label
			}
		}
		contactFormEnabled
		answers {
			id
			contacts {
				...ContactFields
			}
			fieldAnswers {
				singleText {
					fieldId
					values
				}
				multilineText {
					fieldId
					values
				}
				date {
					fieldId
					values
				}
				number {
					fieldId
					values
				}
				singleChoice {
					fieldId
					values
				}
				multiText {
					fieldId
					values
				}
				multiChoice {
					fieldId
					values
				}
			}
		}
	}
`
