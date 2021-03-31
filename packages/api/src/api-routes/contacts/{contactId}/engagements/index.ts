/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Request, Response } from 'express'
import { Operation } from 'express-openapi'

export const GET: Operation = [
	async (req: Request, res: Response): Promise<void> => {
		res.json([
			{
				id: '123',
			},
		])
	},
]
GET.apiDoc = {
	description: 'Get engagements for a contact',
	tags: ['contacts'],
	operationId: 'getContactEngagements',
	parameters: [
		{
			in: 'path',
			name: 'contactId',
			type: 'string',
			required: true,
		},
	],
	responses: {
		default: {
			description: 'Unexpected error',
			schema: {
				$ref: '#/definitions/Error',
			},
		},
	},
}

export const POST: Operation = [
	async (req: Request, res: Response): Promise<void> => {
		res.json([
			{
				id: '123',
			},
		])
	},
]
POST.apiDoc = {
	description: 'Add an engagement to a contact',
	tags: ['contacts'],
	operationId: 'addContactEngagement',
	parameters: [
		{
			in: 'path',
			name: 'contactId',
			type: 'string',
			required: true,
		},
	],
	responses: {
		default: {
			description: 'Unexpected error',
			schema: {
				$ref: '#/definitions/Error',
			},
		},
	},
}
