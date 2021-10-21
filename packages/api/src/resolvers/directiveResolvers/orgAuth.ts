/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ForbiddenError, UserInputError } from 'apollo-server'
import { Organization, RoleType } from '@cbosuite/schema/dist/provider-types'
import { NextResolverFn } from '@graphql-tools/utils'
import { ORGANIZATION_TYPE } from '~dto'
import { AppContext } from '~types'
import { createLogger } from '~utils'
import { empty } from '~utils/noop'

const logger = createLogger('directiveResolvers')

export const orgAuth = async function orgAuth(
	next: NextResolverFn,
	src: any,
	directiveArgs: { requires?: RoleType; [key: string]: any },
	resolverArgs: Record<string, any>,
	context: AppContext,
	info: any,
	loc: string
) {
	const role = directiveArgs.requires || RoleType.User
	const auth = context.components.authenticator
	const { services, users, engagements, contacts, serviceAnswers, tags } = context.collections
	const { identity } = context.requestCtx
	if (!identity) {
		throw new Error(`Insufficient access: user not authenticated`)
	}

	// Utility function for verifying a permissions in a given org
	function checkOrg(orgId: string | null | undefined) {
		if (auth.isUserAtSufficientPrivilege(identity, orgId as string, role)) {
			return next()
		} else {
			logger(`user ${identity!.email} does not have role ${role} in org ${orgId}`)
			return null
		}
	}

	if (src?.__typename === ORGANIZATION_TYPE) {
		//
		// Case 1: user is accessing Organization entity internal data, check if they are in the org
		//
		logger('apply orgAuth to org type')
		const org = src as Organization
		return checkOrg(org.id)
	} else if (resolverArgs['orgId'] != null) {
		//
		// Case 2: User is accessing a query with an orgId query argument
		//
		const orgIdArg = resolverArgs['orgId']
		return checkOrg(orgIdArg)
	} else if (resolverArgs['serviceId']) {
		//
		// Case 3: User is accessing a query/mutation with a serviceId argument (e.g. reports data)
		//
		const serviceIdArg = resolverArgs['serviceId']
		const { item: service } = await services.itemById(serviceIdArg)
		return checkOrg(service?.org_id)
	} else if (resolverArgs['engagementId']) {
		//
		// Case 3.1: User is accessing a query/mutation with a engagement id argument
		//
		const engagementIdArg = resolverArgs['engagementId']
		const { item: engagement } = await engagements.itemById(engagementIdArg)
		return checkOrg(engagement?.org_id)
	} else if (resolverArgs['contactId']) {
		//
		// Case 3.2: User is accessing a query/mutation with a contact id argument
		//
		const contactIdArg = resolverArgs['contactId']
		const { item: contact } = await contacts.itemById(contactIdArg)
		return checkOrg(contact?.org_id)
	} else if (resolverArgs['answerId']) {
		//
		// Case 3.3: User is accessing a query/mutation with an aswer id argument
		//
		const answerIdArg = resolverArgs['answerId']
		const { item: answer } = await serviceAnswers.itemById(answerIdArg)
		if (!answer) {
			throw new UserInputError(`Answer ${answerIdArg} not found`)
		}
		const { item: service } = await services.itemById(answer.service_id)
		return checkOrg(service?.org_id)
	} else if (resolverArgs['userId']) {
		//
		// Case 4: User is accessing a query/mutation with a userId argument (e.g. user password reset)
		//
		const userIdArg = resolverArgs['userId']
		const { item: user } = await users.itemById(userIdArg)
		if (user) {
			const userOrgs = new Set<string>(user.roles.map((r) => r.org_id) ?? empty)
			for (const orgId of userOrgs) {
				// only admins can take actions on user entities in their org
				if (auth.isUserAtSufficientPrivilege(identity, orgId, RoleType.Admin)) {
					return next()
				}
			}
		}
		throw new ForbiddenError(
			`Insufficient access: user ${identity.email} does not have role ${RoleType.Admin} in any orgs shared with target user ${user?.email}`
		)
	} else if (
		resolverArgs['engagement'] != null ||
		resolverArgs['contact'] != null ||
		resolverArgs['service'] != null
	) {
		//
		// Case 5: User is mutating an entity with an attached (and required) orgId
		//
		const item = resolverArgs['engagement'] || resolverArgs['contact'] || resolverArgs['service']
		return checkOrg(item.orgId) // check input type orgId
	} else if (resolverArgs['serviceAnswer']) {
		//
		// Case 6: User is mutating an serviceanswer entity; check org in service id
		//
		const answer = resolverArgs['serviceAnswer']
		const { item: service } = await services.itemById(answer.serviceId)
		return checkOrg(service?.org_id)
	} else if (resolverArgs['tag']) {
		//
		// Case 7: User is mutating a tag entity
		//
		const tagArg = resolverArgs['tag']
		const { item: tag } = await tags.itemById(tagArg.id)
		return checkOrg(tag?.org_id)
	} else {
		// const result = await next()
		// if (result.orgId != null) {
		// 	//
		// 	// Case 5: Data is returning with an attached orgId (NOT MUTATION)
		// 	//
		// 	if (auth.isUserAtSufficientPrivilege(identity, result.orgId, role)) {
		// 		// TODO: verify not mutation
		// 		return next()
		// 	} else {
		// 		throw new ForbiddenError(
		// 			`Insufficient access: user ${identity.email} does not have role ${role} in org ${result.orgId}`
		// 		)
		// 	}
		// } else {
		//
		// Case 6: No org data available in result, parent, or args. Throw an error
		//
		logger('cannot orgauth', loc)
		throw new Error(`cannot orgAuth at location "${loc}"`)
		// }
	}
}
