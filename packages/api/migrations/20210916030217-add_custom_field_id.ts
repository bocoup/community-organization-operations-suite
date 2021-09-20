/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'
import { v4 as createId } from 'uuid'

module.exports = {
	async up(db: Db) {
		try {
			await db
				.collection('services')
				.find()
				.forEach(async (service) => {
					if (!service.customFields.some((field: any) => field.fieldId)) {
						const updatedCustomFields = service.customFields.map((customField: any) => {
							let newFieldValue = {}
							if (
								customField.fieldType === 'singleChoice' ||
								customField.fieldType === 'multiChoice' ||
								customField.fieldType === 'multiText'
							) {
								newFieldValue = customField.fieldValue.map((value: any) => {
									if (typeof value === 'string') {
										return {
											id: createId(),
											label: value
										}
									} else {
										return {
											id: value.id || createId(),
											label: value.label
										}
									}
								})
							} else {
								newFieldValue = customField.fieldValue
							}

							return {
								...customField,
								fieldId: customField.fieldId || createId(),
								fieldValue: newFieldValue
							}
						})

						await db
							.collection('services')
							.updateOne({ _id: service._id }, { $set: { customFields: updatedCustomFields } })

						if (service.answers) {
							const updatedAnswers = service.answers.map((answer: any) => {
								const fieldType = Object.keys(answer.fieldAnswers)
								const newFieldAnswersValue: any = {}
								fieldType.forEach((ft: any) => {
									if (answer.fieldAnswers[ft] && answer.fieldAnswers[ft].length > 0) {
										const answers = answer.fieldAnswers[ft]
										if (
											ft === 'multilineText' ||
											ft === 'singleText' ||
											ft === 'date' ||
											ft === 'number'
										) {
											newFieldAnswersValue[ft] = answers.map((answer: any) => {
												return {
													fieldId: updatedCustomFields.find(
														(cf: any) => cf.fieldName === answer.label
													).fieldId,
													values: answer.value
												}
											})
										}

										if (ft === 'singleChoice') {
											newFieldAnswersValue[ft] = answers.map((answer: any) => {
												return {
													fieldId: updatedCustomFields.find(
														(cf: any) => cf.fieldName === answer.label
													).fieldId,
													values: updatedCustomFields.fieldValue.find(
														(cf: any) => cf.id === answer.value
													).id
												}
											})
										}

										if (ft === 'multiChoice') {
											newFieldAnswersValue[ft] = answers.map((answer: any) => {
												const fieldValues = updatedCustomFields.find(
													(cf: any) =>
														cf.fieldType === 'multiChoice' && cf.fieldName === answer.label
												).fieldValue

												return {
													fieldId: updatedCustomFields.find(
														(cf: any) => cf.fieldName === answer.label
													).fieldId,
													values: answer.value.map(
														(value: any) => fieldValues.find((fv: any) => fv.label === value).id
													)
												}
											})
										}
									} else {
										newFieldAnswersValue[ft] = null
									}
								})

								return {
									...answer,
									fieldAnswers: newFieldAnswersValue
								}
							})

							await db
								.collection('services')
								.updateOne({ _id: service._id }, { $set: { answers: updatedAnswers } })
						}
					}
				})
		} catch (error) {
			throw error
		}
	},

	async down(db: Db) {
		try {
			await db
				.collection('services')
				.find()
				.forEach(async (service) => {
					const revertedAnswers = service.answers.map((answer: any) => {
						const fieldType = Object.keys(answer.fieldAnswers)
						const revertedFieldAnswersValue: any = {}
						fieldType.forEach((ft: any) => {
							if (answer.fieldAnswers[ft] && answer.fieldAnswers[ft].length > 0) {
								const answers = answer.fieldAnswers[ft]

								if (
									ft === 'multilineText' ||
									ft === 'singleText' ||
									ft === 'date' ||
									ft === 'number'
								) {
									revertedFieldAnswersValue[ft] = answers.map((answer: any) => {
										return {
											label: service.customFields.find((cf: any) => cf.fieldId === answer.fieldId)
												.fieldName,
											value: answer.values
										}
									})
								}

								if (ft === 'singleChoice') {
									revertedFieldAnswersValue[ft] = answers.map((answer: any) => {
										return {
											label: service.customFields.find((cf: any) => cf.fieldId === answer.fieldId)
												.fieldName,
											value: service.customFields
												.find((cf: any) => cf.fieldId === answer.fieldId)
												.fieldValue.find((cf: any) => cf.id === answer.values).label
										}
									})
								}

								if (ft === 'multiChoice') {
									revertedFieldAnswersValue[ft] = answers.map((answer: any) => {
										const fieldValues = service.customFields.find(
											(cf: any) => cf.fieldType === 'multiChoice' && cf.fieldId === answer.fieldId
										).fieldValue

										return {
											label: service.customFields.find((cf: any) => cf.fieldId === answer.fieldId)
												.fieldName,
											value: answer.values.map(
												(value: any) => fieldValues.find((fv: any) => fv.id === value).label
											)
										}
									})
								}
							} else {
								revertedFieldAnswersValue[ft] = null
							}
						})

						return {
							...answer,
							fieldAnswers: revertedFieldAnswersValue
						}
					})

					await db
						.collection('services')
						.updateOne({ _id: service._id }, { $set: { answers: revertedAnswers } })

					const revertedCustomFields = service.customFields.map((customField: any) => {
						let newFieldValue = {}
						if (
							customField.fieldType === 'singleChoice' ||
							customField.fieldType === 'multiChoice' ||
							customField.fieldType === 'multiText'
						) {
							newFieldValue = customField.fieldValue.map((value: any) => value.label)
						} else {
							newFieldValue = []
						}

						delete customField.fieldId

						return {
							...customField,
							fieldValue: newFieldValue
						}
					})

					await db
						.collection('services')
						.updateOne({ _id: service._id }, { $set: { customFields: revertedCustomFields } })
				})
		} catch (error) {
			throw error
		}
	}
}
