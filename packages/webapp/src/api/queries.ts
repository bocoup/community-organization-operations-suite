/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { gql } from '@apollo/client'

/*
 * Exhaustive List of ALL GraphQL queries (Query & Mutations).
 */

// ENGAGEMENTS === Request

import { EngagementFields } from '../hooks/api/fragments'

export const GET_ENGAGEMENTS = gql`
	${EngagementFields}

	query allEngagements($orgId: String!) {
		allEngagements(orgId: $orgId) {
			...EngagementFields
		}
	}
`

export const GET_ACTIVES_ENGAGEMENTS = gql`
	${EngagementFields}

	query activeEngagements($orgId: String!) {
		activeEngagements(orgId: $orgId) {
			...EngagementFields
		}
	}
`

export const GET_USER_ACTIVES_ENGAGEMENTS = gql`
	${EngagementFields}

	query activeEngagements($orgId: String!, $userId: String!) {
		activeEngagements(orgId: $orgId, userId: $userId) {
			...EngagementFields
		}
		userActiveEngagements(orgId: $orgId, userId: $userId) {
			...EngagementFields
		}
	}
`

export const GET_INACTIVE_ENGAGEMENTS = gql`
	${EngagementFields}

	query inactiveEngagements($orgId: String!) {
		inactiveEngagements(orgId: $orgId) {
			...EngagementFields
		}
	}
`

export const SUBSCRIBE_TO_ORG_ENGAGEMENTS = gql`
	${EngagementFields}

	subscription engagementUpdate($orgId: String!) {
		engagements(orgId: $orgId) {
			message
			action
			engagement {
				...EngagementFields
			}
		}
	}
`
