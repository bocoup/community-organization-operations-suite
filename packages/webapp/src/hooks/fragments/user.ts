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
