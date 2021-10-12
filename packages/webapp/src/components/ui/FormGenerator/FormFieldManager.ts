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
import { useMemo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { empty } from '~utils/noop'
import { createLogger } from '~utils/createLogger'

const log = createLogger('form-field-manager')

type Localizer = (input: string) => string
export class FormFieldManager {
	private _values: ServiceFieldAnswerInput = {}
	private _errors = new Map<string, string>()

	public constructor(
		public service: Service,
		public answers: ServiceAnswers,
		private t: Localizer
	) {}

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

	public validateFields(): boolean {
		const values = this.values
		const t = this.t

		this._errors.clear()
		for (const field of this.fields) {
			if (isRequired(field) && !this.isFieldValueRecorded(field)) {
				log(`validation errer: field ${field.fieldName} is required and not present`)
				this.addFieldError(field.fieldId, t('formGenerator.validation.required'))
			}

			if (field.fieldType === 'number') {
				const value = this.getRecordedFieldValue(field)
				if (isNaN(value)) {
					log(`validation errer: field ${field.fieldName} is numeric with a non-numeric value`)
					this.addFieldError(field.fieldId, t('formGenerator.validation.numeric'))
				}
			}
		}

		const areFieldsValid = this._errors.size === 0
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
		const vt = values[type]
		const index = vt.findIndex((f) => f.fieldId === id)
		if (index === -1) {
			vt.push({ fieldId: id, values: value })
		} else {
			vt[index].values = value
		}
	}

	public saveFieldMultiValue(
		{ fieldType: type, fieldId: id }: ServiceCustomField,
		value: any,
		checked: boolean
	) {
		const values = this.values
		if (!values[type]) {
			values[type] = []
		}
		const vt = values[type]
		const index = vt.findIndex((f) => f.fieldId === id)
		if (index === -1) {
			vt.push({ fieldId: id, values: [value.id] })
		} else {
			const fv = vt[index]
			const selected = (fv.values ?? empty).filter((v) => v !== value.id)
			fv.values = checked ? [...selected, value.id] : selected
		}
	}

	public isSubmitEnabled() {
		return this.validateFields() && this._errors.size === 0
	}
}

function isRequired(field: ServiceCustomField) {
	return field.fieldRequirements === 'required'
}

function extractFieldValue(
	v: ServiceFieldAnswer | ServiceFieldAnswerInput,
	{ fieldType: type, fieldId: id }: ServiceCustomField
) {
	return v ? v[type]?.find((f) => f.fieldId === id)?.values : null
}

export function useFormFieldManager(service: Service, answers: ServiceAnswers): FormFieldManager {
	const { t } = useTranslation('services')
	const mgr = useMemo(() => new FormFieldManager(service, answers, t), [service, answers, t])
	return mgr
}
