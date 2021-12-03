/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { validateAnswer } from '../formValidation'
import { DbService, DbServiceField } from '../../db'
import { v4 } from 'uuid'
import {
	ServiceFieldRequirement,
	ServiceFieldType,
	ServiceStatus
} from '@cbosuite/schema/dist/provider-types'

function allRequired(service: DbService): DbService {
	return {
		...service,
		fields: [
			...service.fields.map((f) => ({
				...f,
				requirement: ServiceFieldRequirement.Required
			}))
		]
	}
}

describe('the validateAnswer function', () => {
	it('can validate field requirements', () => {
		expect(() =>
			validateAnswer(singleTextService, {
				serviceId: singleTextService.id,
				fields: []
			})
		).not.toThrow()
		expect(() =>
			validateAnswer(allRequired(singleTextService), {
				serviceId: singleTextService.id,
				fields: []
			})
		).toThrow(/Missing required field/)
		expect(() =>
			validateAnswer(allRequired(singleTextService), {
				serviceId: singleTextService.id,
				fields: [
					{
						fieldId: singleTextService.fields[0].id,
						value: 'heeey'
					}
				]
			})
		).not.toThrow()
	})

	it('will throw if a field id is unrecognized', () => {
		expect(() =>
			validateAnswer(singleTextService, {
				serviceId: singleTextService.id,
				fields: [
					{
						fieldId: 'abc'
					}
				]
			})
		).toThrow(/Invalid field id/)
	})

	it('will throw if a field type is unrecognized', () => {
		const service = {
			...singleTextService,
			fields: [
				{
					...singleTextService.fields[0],
					type: 'abc',
					requirement: ServiceFieldRequirement.Required
				}
			]
		}
		expect(() =>
			validateAnswer(service, {
				serviceId: singleTextService.id,
				fields: [
					{
						fieldId: singleTextService.fields[0].id,
						value: 'heeey'
					}
				]
			})
		).toThrow(/Invalid field type/)
	})

	it('can validate date fields', () => {
		expect(() =>
			validateAnswer(singleDateService, {
				serviceId: singleDateService.id,
				fields: [
					{
						fieldId: singleDateService.fields[0].id,
						value: new Date().toISOString()
					}
				]
			})
		).not.toThrow()
		expect(() =>
			validateAnswer(singleDateService, {
				serviceId: singleDateService.id,
				fields: [
					{
						fieldId: singleDateService.fields[0].id
					}
				]
			})
		).not.toThrow()

		expect(() =>
			validateAnswer(singleDateService, {
				serviceId: singleDateService.id,
				fields: [
					{
						fieldId: singleDateService.fields[0].id,
						value: 'fart'
					}
				]
			})
		).toThrow(/unparseable date/)
	})

	it('can validate number fields', () => {
		expect(() =>
			validateAnswer(singleNumberService, {
				serviceId: singleNumberService.id,
				fields: [
					{
						fieldId: singleNumberService.fields[0].id,
						value: '12345'
					}
				]
			})
		).not.toThrow()

		expect(() =>
			validateAnswer(singleNumberService, {
				serviceId: singleNumberService.id,
				fields: [
					{
						fieldId: singleNumberService.fields[0].id,
						value: '123fart'
					}
				]
			})
		).toThrow(/unparseable number/)
	})

	it('can validate a single choice field', () => {
		expect(() =>
			validateAnswer(singleChoiceService, {
				serviceId: singleChoiceService.id,
				fields: [
					{
						fieldId: singleChoiceService.fields[0].id,
						value: 'derp'
					}
				]
			})
		).toThrow(/choice not found/)
		expect(() =>
			validateAnswer(singleChoiceService, {
				serviceId: singleChoiceService.id,
				fields: [
					{
						fieldId: singleChoiceService.fields[0].id,
						values: [singleChoiceService.fields[0].inputs[0].id]
					}
				]
			})
		).toThrow(/did not expect a values array/)
		expect(() =>
			validateAnswer(singleChoiceService, {
				serviceId: singleChoiceService.id,
				fields: [
					{
						fieldId: singleChoiceService.fields[0].id,
						value: singleChoiceService.fields[0].inputs[0].id
					}
				]
			})
		).not.toThrow()
	})

	it('can validate a multi choice field', () => {
		expect(() =>
			validateAnswer(multiChoiceService, {
				serviceId: multiChoiceService.id,
				fields: [
					{
						fieldId: multiChoiceService.fields[0].id,
						values: ['derp']
					}
				]
			})
		).toThrow(/choice not found/)
		expect(() =>
			validateAnswer(multiChoiceService, {
				serviceId: multiChoiceService.id,
				fields: [
					{
						fieldId: multiChoiceService.fields[0].id,
						value: multiChoiceService.fields[0].inputs[0].id
					}
				]
			})
		).toThrow(/did not expect a single value/)
		expect(() =>
			validateAnswer(allRequired(multiChoiceService), {
				serviceId: multiChoiceService.id,
				fields: [
					{
						fieldId: multiChoiceService.fields[0].id,
						values: []
					}
				]
			})
		).toThrow(/Missing required value/)

		expect(() =>
			validateAnswer(multiChoiceService, {
				serviceId: multiChoiceService.id,
				fields: [
					{
						fieldId: multiChoiceService.fields[0].id,
						values: [multiChoiceService.fields[0].inputs[0].id]
					}
				]
			})
		).not.toThrow()
		expect(() =>
			validateAnswer(multiChoiceService, {
				serviceId: multiChoiceService.id,
				fields: [
					{
						fieldId: multiChoiceService.fields[0].id
					}
				]
			})
		).not.toThrow()
	})
})

function serviceWithFields(...fields: DbServiceField[]): DbService {
	return {
		id: v4(),
		org_id: '',
		name: 'Test Service',
		status: ServiceStatus.Active,
		contactFormEnabled: false,
		fields
	}
}
const singleTextService = serviceWithFields({
	id: v4(),
	name: 'Allergens',
	type: ServiceFieldType.SingleText,
	requirement: ServiceFieldRequirement.Optional
})
const singleDateService = serviceWithFields({
	id: v4(),
	name: 'Date',
	type: ServiceFieldType.Date,
	inputs: [],
	requirement: ServiceFieldRequirement.Optional
})
const singleNumberService = serviceWithFields({
	id: v4(),
	name: 'Date',
	type: ServiceFieldType.Number,
	inputs: [],
	requirement: ServiceFieldRequirement.Optional
})
const singleChoiceService = serviceWithFields({
	id: v4(),
	name: 'Cereal',
	type: ServiceFieldType.SingleChoice,
	inputs: [
		{ id: v4(), label: 'Wheaties' },
		{ id: v4(), label: 'Oaties' },
		{ id: v4(), label: 'Raisins' }
	],
	requirement: ServiceFieldRequirement.Optional
})
const multiChoiceService = serviceWithFields({
	id: v4(),
	name: 'Cereal',
	type: ServiceFieldType.MultiChoice,
	inputs: [
		{ id: v4(), label: 'Wheaties' },
		{ id: v4(), label: 'Oaties' },
		{ id: v4(), label: 'Raisins' }
	],
	requirement: ServiceFieldRequirement.Optional
})
