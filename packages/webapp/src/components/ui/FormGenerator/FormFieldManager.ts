/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Service,
	ServiceAnswers,
	ServiceCustomField,
	ServiceFieldAnswer,
	ServiceFieldAnswerInput
} from '@cbosuite/schema/dist/client-types'
import { useEffect, useMemo } from 'react'
import { empty } from '~utils/noop'

export class FormFieldManager {
	private _values: ServiceFieldAnswerInput = {}
	private _answers: ServiceAnswers
	private _service: Service | null = null
	private _errors = new Map<string, string>()

	public get service(): Service {
		return this._service
	}

	public set service(service: Service) {
		this._service = service
	}

	public get answers(): ServiceAnswers {
		return this._answers
	}

	public set answers(answers: ServiceAnswers) {
		this._answers = answers
	}

	public get values(): ServiceFieldAnswerInput {
		return this._values
	}

	public addFieldError(fieldId: string, errorMessage: string) {
		this._errors.set(fieldId, errorMessage)
	}

	private get fields(): ServiceCustomField[] {
		return this.service?.customFields || empty
	}

	public clearFieldError(fieldId: string) {
		if (this._errors.has(fieldId)) {
			this._errors.delete(fieldId)
		}
	}

	public getErrorMessage(fieldId: string): string | undefined {
		if (this._errors.has(fieldId)) {
			return this._errors.get(fieldId)
		}
		return null
	}

	public validateRequiredFields(): boolean {
		const values = this.values
		let areFieldsValid = true
		for (const field of this.fields) {
			if (isRequired(field) && !this.isFieldValueRecorded(field)) {
				areFieldsValid = false
			}
		}

		const areContactsValid = this.service.contactFormEnabled ? values['contacts']?.length > 0 : true
		return areFieldsValid && areContactsValid
	}

	public getAnsweredFieldValue(field: ServiceCustomField): any {
		return extractFieldValue(this.answers?.fieldAnswers, field)
	}

	public getRecordedFieldValue(field: ServiceCustomField) {
		return extractFieldValue(this.values, field)
	}

	public isFieldValueRecorded(field: ServiceCustomField) {
		const fieldValue = this.getRecordedFieldValue(field)
		if (fieldValue == null) {
			return false
		} else if (Array.isArray(fieldValue) && fieldValue.length === 0) {
			return false
		} else if (fieldValue === '') {
			return false
		}
		return true
	}

	public saveFieldValue({ fieldId: id, fieldType: type }: ServiceCustomField, value: any) {
		const values = this.values
		if (!values[type]) {
			values[type] = []
		}
		const index = values[type].findIndex((f) => f.fieldId === id)
		if (index === -1) {
			values[type].push({ fieldId: id, values: value })
		} else {
			values[type][index].values = value
		}
	}

	public saveFieldMultiValue(field: ServiceCustomField, value: any, checked: boolean) {
		const values = this.values
		if (!values[field.fieldType]) {
			values[field.fieldType] = []
		}
		const index = values[field.fieldType].findIndex((f) => f.fieldId === field.fieldId)
		if (index === -1) {
			values[field.fieldType].push({ fieldId: field.fieldId, values: [value.id] })
		} else {
			const fv = values[field.fieldType][index]
			const selected = (fv.values ?? empty).filter((v) => v !== value.id)
			fv.values = checked ? [...selected, value.id] : selected
		}
	}

	public isSubmitEnabled() {
		return this.validateRequiredFields() && this._errors.size === 0
	}
}

const isRequired = (field: ServiceCustomField) => field.fieldRequirements === 'required'

function extractFieldValue(
	v: ServiceFieldAnswer | ServiceFieldAnswerInput,
	{ fieldType: type, fieldId: id }: ServiceCustomField
) {
	return v ? v[type]?.find((f) => f.fieldId === id)?.values : null
}

export function useFormFieldManager(service: Service, answers: ServiceAnswers): FormFieldManager {
	const mgr = useMemo(() => new FormFieldManager(), [])
	useEffect(() => {
		mgr.service = service
	}, [service, mgr])
	useEffect(() => {
		mgr.answers = answers
	}, [answers, mgr])
	return mgr
}
