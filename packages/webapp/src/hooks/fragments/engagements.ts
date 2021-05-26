import { gql } from '@apollo/client'
import { UserFields } from './user'

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
		date
		comment
		tags {
			...TagFields
		}
	}
`
