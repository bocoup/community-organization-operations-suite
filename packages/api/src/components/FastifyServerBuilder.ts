/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import http from 'http'
import fastify, { FastifyInstance, FastifyPluginCallback } from 'fastify'
import fastifyCors from 'fastify-cors'
import { singleton } from 'tsyringe'
import { Configuration } from './Configuration'
import { ContactCollection } from '~db/ContactCollection'
import { EngagementCollection } from '~db/EngagementCollection'
import { OrganizationCollection } from '~db/OrganizationCollection'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { ServiceCollection } from '~db/ServiceCollection'
import { TagCollection } from '~db/TagCollection'
import { UserCollection } from '~db/UserCollection'
import { EngagementStatus } from '@cbosuite/schema/dist/provider-types'

@singleton()
export class FastifyServerBuilder {
	private app: FastifyInstance

	public constructor(
		config: Configuration,
		contacts: ContactCollection,
		engagements: EngagementCollection,
		orgs: OrganizationCollection,
		serviceAnswers: ServiceAnswerCollection,
		services: ServiceCollection,
		tags: TagCollection,
		users: UserCollection
	) {
		this.app = fastify()
		/***
		 * Wire up RESTful, static endpoints
		 */
		this.app.get('/version', (_request, reply) => {
			reply.send({ version: config.version })
		})
		this.app.get('/metrics', async (request, reply) => {
			const [
				user_count,
				org_count,
				contact_count,
				service_count,
				service_answer_count,
				services_with_responses,
				engagement_count,
				closed_engagement_count,
				completed_engagement_count,
				tag_count
			] = await Promise.all([
				users.count(),
				orgs.count(),
				contacts.count(),
				services.count(),
				serviceAnswers.count(),
				serviceAnswers.distinct('service_id'),
				engagements.count(),
				engagements.count({ status: EngagementStatus.Closed }),
				engagements.count({ status: EngagementStatus.Completed }),
				tags.count()
			])

			reply.send({
				user_count,
				org_count,
				contact_count,
				service_count,
				service_answer_count,
				services_with_responses,
				engagement_count,
				closed_engagement_count,
				completed_engagement_count,
				tag_count
			})
		})
	}

	public get server(): http.Server {
		return this.app.server
	}
	public build(apolloHandler: FastifyPluginCallback): FastifyInstance {
		this.app.register(apolloHandler)
		this.app.register(fastifyCors, FASTIFY_CORS_OPTIONS)
		this.app.ready()
		return this.app
	}
}

const FASTIFY_CORS_OPTIONS = {
	origin: '*',
	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
}
