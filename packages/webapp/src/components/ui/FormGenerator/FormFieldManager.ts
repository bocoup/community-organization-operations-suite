/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Service,
	ServiceAnswer,
	ServiceField,
	ServiceAnswerFieldInput,
	ServiceFieldRequirement,
	ServiceFieldType
} from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { empty } from '~utils/noop'
import { createLogger } from '~utils/createLogger'

const log = createLogger('form-field-manager')

type Localizer = (input: string) => string
export class FormFieldManager {
	public contacts: string[] = []
	private _values: ServiceAnswerFieldInput[] = []

	private _errors = new Map<string, string>()

	public constructor(
		public service: Service,
		public answers: ServiceAnswer,
		private t: Localizer
	) {}

	public get values() {
		return this._values
	}

	public addFieldError(fieldId: string, errorMessage: string) {
		this._errors.set(fieldId, errorMessage)
	}

	private get fields(): ServiceField[] {
		return this.service?.fields || empty
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
		const t = this.t

		this._errors.clear()
		for (const field of this.fields) {
			if (isRequired(field) && !this.isFieldValueRecorded(field)) {
				log(`validation errer: field ${field.name} is required and not present`)
				this.addFieldError(field.id, t('formGenerator.validation.required'))
			}

			if (field.type === ServiceFieldType.Number) {
				const value = this.getRecordedFieldValue(field) as string
				if (Number.isNaN(value)) {
					log(`validation errer: field ${field.name} is numeric with a non-numeric value`)
					this.addFieldError(field.id, t('formGenerator.validation.numeric'))
				}
			}
		}

		const areFieldsValid = this._errors.size === 0
		const areContactsValid = this.service.contactFormEnabled ? this.contacts.length > 0 : true
		return areFieldsValid && areContactsValid
	}

	public getAnsweredFieldValue(field: ServiceField): any {
		const answerField = this.answers?.fields.find((f) => f.fieldId === field.id)
		return Array.isArray(answerField.values) ? answerField.values : answerField.value
	}

	public getRecordedFieldValue(field: ServiceField) {
		const answerField = this.answers?.fields.find((f) => f.fieldId === field.id)
		return Array.isArray(answerField.values) ? answerField.values : answerField.value
	}

	public isFieldValueRecorded(field: ServiceField) {
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

	public saveFieldValue({ id, type }: ServiceField, value: any) {
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

	public saveFieldMultiValue({ type, id }: ServiceField, value: any, checked: boolean) {
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

function isRequired(field: ServiceField): boolean {
	return field.requirement === ServiceFieldRequirement.Required
}

export function useFormFieldManager(service: Service, answers: ServiceAnswer): FormFieldManager {
	const { t } = useTranslation('services')
	const mgr = useMemo(() => new FormFieldManager(service, answers, t), [service, answers, t])
	return mgr
}
