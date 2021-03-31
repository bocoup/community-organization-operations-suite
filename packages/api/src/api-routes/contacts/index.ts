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
	description: 'Retrieve a list of contacts',
	tags: ['contacts'],
	operationId: 'getContacts',
	parameters: [
		{
			in: 'query',
			name: 'status',
			type: 'boolean',
			required: false,
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
		res.status(201).json([
			{
				id: '123',
			},
		])
	},
]
POST.apiDoc = {
	description: 'Create a new contact',
	tags: ['contacts'],
	operationId: 'createContact',
	parameters: [],
	responses: {
		default: {
			description: 'Unexpected error',
			schema: {
				$ref: '#/definitions/Error',
			},
		},
	},
}
