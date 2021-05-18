/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import fastify, { FastifyInstance } from 'fastify'
import fastifyCors from 'fastify-cors'
import { DirectiveNode } from 'graphql'
import mercurius from 'mercurius'
import mercuriusAuth, { MercuriusAuthOptions } from 'mercurius-auth'
import pino from 'pino'
import { Authenticator } from './Authenticator'
import { Configuration } from './Configuration'
import { resolvers } from './resolvers'
import { AuthArgs, Context } from './types'
import { RoleType } from '@greenlight/schema/lib/provider-types'

export class AppBuilder {
	#app: FastifyInstance

	public constructor(config: Configuration, authenticator: Authenticator) {
		this.#app = fastify({ logger: pino({}) }).register(fastifyCors)
		//
		// Index Endpoint
		//
		this.#app.get('/', async (req, res) => {
			res.type('text/html').code(200)
			return renderIndex(config)
		})

		//
		// Health Endpoint
		//
		this.#app.get('/health', async (req, res) => {
			res.type('application/json').code(200)
			return { status: 'ok' }
		})

		// GraphQL Schema
		const schema = getSchema()
		this.#app.register(mercurius, {
			schema,
			resolvers,
			graphiql: config.graphiql,
		})

		//
		// orgAuth Directive
		//
		const authOptions: MercuriusAuthOptions<any, AuthArgs, Context> = {
			authDirective: 'orgAuth',
			async authContext(context) {
				const authHeader: string =
					context.reply.request.headers['Authorization']
				const bearerToken = authenticator.extractBearerToken(authHeader)
				const user = await authenticator.getUser(bearerToken)
				return { identity: user }
			},
			async applyPolicy(authDirectiveAST, parent, args, context, info) {
				const requires: RoleType = getOrgAuthRequiresArgument(authDirectiveAST)
				const { orgId } = args
				const user = context.auth.identity
				const [isInOrg, isAtSufficientPrivilege] = await Promise.all([
					authenticator.isUserInOrg(user, orgId),
					authenticator.isUserAtSufficientPrivilege(
						authenticator,
						orgId,
						requires
					),
				])
				if (!isInOrg) {
					throw new Error(
						`Insufficient access: user ${user} is not a member of ${orgId}`
					)
				}
				if (!isAtSufficientPrivilege) {
					throw new Error(
						`Insufficient access: user ${user} does not have role ${requires} in org ${orgId}`
					)
				}

				return true
			},
		}
		this.#app.register<MercuriusAuthOptions>(mercuriusAuth, authOptions)
	}

	public get app(): FastifyInstance {
		return this.#app
	}
}

function renderIndex(config: Configuration): string {
	return `
<body>
	<h1>Greenlight API</h1>
	<ul>
		<li><a href="/health">Health</a></li>
		${config.graphiql ? '<li><a href="/playground">Playground</a></li>' : ''}
	</ul>
</body>
`
}

function getOrgAuthRequiresArgument(ast: DirectiveNode): RoleType {
	if (ast.arguments) {
		if (ast.arguments.length > 0) {
			const argument = (ast.arguments[0].value as any).value as RoleType
			return argument
		}
	}
	return 'USER' as RoleType
}

function getSchema(): string {
	return fs.readFileSync(require.resolve('@greenlight/schema/schema.gql'), {
		encoding: 'utf-8',
	})
}
