/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RoleType, OrgAuthDirectiveArgs } from '@cbosuite/schema/dist/provider-types'
import type { DbUser } from '~db/types'

export interface Interactor<S, I, O> {
	execute(self: S, input: I, ctx: RequestContext): Promise<O>
}

export interface Provider<T> {
	get(): T
}
export interface AsyncProvider<T> {
	get(): Promise<T>
}

export type User = DbUser

export interface AuthArgs {
	/**
	 * The ID of the organization being authenticated into
	 */
	orgId: string
	requires: RoleType
}

export interface OrgAuthEvaluationStrategy {
	name: string
	isApplicable(src: any, resolverArgs: any, ctx: RequestContext): boolean
	isAuthorized(
		src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: Record<string, any>,
		ctx: RequestContext
	): Promise<boolean>
}

export interface RequestContext {
	identity: User | null // requesting user auth identity
	locale: string
}
