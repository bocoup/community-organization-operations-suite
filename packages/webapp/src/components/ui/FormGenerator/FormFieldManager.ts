/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Service,
	ServiceAnswer,
	ServiceField,
	ServiceAnswerInput
} from '@cbosuite/schema/dist/client-types'
import { ServiceFieldType } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { empty } from '~utils/noop'
import { createLogger } from '~utils/createLogger'
import { getPendingFieldValue, getRecordedFieldValue, isRequired } from '~utils/forms'

const log = createLogger('form-field-manager')

type Localizer = (input: string) => string
export class FormFieldManager {
	private _values: ServiceAnswerInput
	private _errors = new Map<string, string>()

	public constructor(public service: Service, public answers: ServiceAnswer, private t: Localizer) {
		this._values = {
			serviceId: service.id,
			contacts: [],
			fields: []
		}
	}

	public get value() {
		return this._values
	}

	public reset() {
		this._values.contacts = empty
		this._values.fields = []
	}

	public addFieldError(fieldId: string, errorMessage: string) {
		this._errors.set(fieldId, errorMessage)
	}

	private get fields(): ServiceField[] {
		return this.service?.fields || empty
	}

	private getInputForField(field: ServiceField) {
		return getPendingFieldValue(this.value, field)
	}

	public clearFieldError(fieldId: string) {
		if (this.hasErrorInField(fieldId)) {
			this._errors.delete(fieldId)
		}
	}

	public getfieldPlaceholderText(fieldType) {
		const t = this.t
		switch (fieldType) {
			case ServiceFieldType.SingleText:
				return t('formGenerator.placeholder.textField')
			case ServiceFieldType.Number:
				return t('formGenerator.placeholder.numberField')
			default:
				return ''
		}
	}

	public hasErrorInField(fieldId: string): boolean {
		return this._errors.has(fieldId)
	}

	public getErrorMessage(fieldId: string): string | undefined {
		if (this.hasErrorInField(fieldId)) {
			return this._errors.get(fieldId)
		}
		return null
	}

	public validateFields(): boolean {
		const t = this.t

		this._errors.clear()
		for (const field of this.fields) {
			if (isRequired(field) && !this.isFieldValueRecorded(field)) {
				log(`validation error: field ${field.name} is required and not present`, this.value)
				this.addFieldError(field.id, t('formGenerator.validation.requiredField'))
			}

			if (field.type === ServiceFieldType.Number) {
				const value = this.getRecordedFieldValue(field) as string
				if (isRequired(field) && Number.isNaN(tryParseNumber(value))) {
					log(`validation error: field ${field.name} is numeric with a non-numeric value`)
					this.addFieldError(field.id, t('formGenerator.validation.numberField'))
				}
			}
		}

		const areFieldsValid = this._errors.size === 0
		const areContactsValid = this.service.contactFormEnabled ? this.value.contacts.length > 0 : true
		return areFieldsValid && areContactsValid
	}

	public getAnsweredFieldValue(field: ServiceField): any {
		const answerField = getRecordedFieldValue(this.answers, field)
		if (!answerField) {
			return null
		}
		return Array.isArray(answerField.values) ? answerField.values : answerField.value
	}

	public getRecordedFieldValue(field: ServiceField): string {
		const inputValue = this.getInputForField(field)
		if (!inputValue) {
			return null
		}
		return inputValue.value
	}

	public getRecordedFieldValueList(field: ServiceField) {
		const inputValue = this.getInputForField(field)
		if (!inputValue) {
			return empty
		}
		return inputValue.values
	}

	public isFieldValueRecorded(field: ServiceField) {
		switch (field.type) {
			case ServiceFieldType.SingleText:
			case ServiceFieldType.Number:
			case ServiceFieldType.Date:
			case ServiceFieldType.MultilineText:
			case ServiceFieldType.SingleChoice:
				const singleValue = this.getRecordedFieldValue(field)
				return singleValue != null && singleValue.length > 0
			case ServiceFieldType.MultiChoice:
				const multiValue = this.getRecordedFieldValueList(field)
				return multiValue != null && multiValue.length > 0
		}
	}

	public saveFieldSingleValue({ id }: ServiceField, value?: string) {
		const values = this.value.fields
		const index = values.findIndex((f) => f.fieldId === id)
		if (index === -1) {
			values.push({
				fieldId: id,
				value
			})
		} else {
			values[index].value = value
		}
	}

	public saveFieldMultiValue({ id }: ServiceField, value: string[]) {
		const fields = this.value.fields
		const index = fields.findIndex((f) => f.fieldId === id)
		if (index === -1) {
			fields.push({ fieldId: id, values: value })
		} else {
			fields[index].values = value
		}
	}

	public isSubmitEnabled() {
		return this.validateFields() && this._errors.size === 0
	}
}

export function useFormFieldManager(service: Service, answers: ServiceAnswer): FormFieldManager {
	const { t } = useTranslation(Namespace.Services)
	const mgr = useMemo(() => new FormFieldManager(service, answers, t), [service, answers, t])
	return mgr
}

/**
 * parseInt is too weak - it will allow non-numeric values to leak in.
 * try parseInt("123xyz")
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
 * @param value
 * @returns
 */
export function tryParseNumber(value: string) {
	if (/^[-+]?(\d+|Infinity)$/.test(value)) {
		return Number(value)
	} else {
		return NaN
	}
}

export function useInitialFieldValue(
	field: ServiceField,
	mgr: FormFieldManager,
	editMode: boolean
) {
	return useMemo(() => {
		if (editMode && !mgr.isFieldValueRecorded(field)) {
			const fieldValue = mgr.getAnsweredFieldValue(field) || ''
			mgr.saveFieldSingleValue(field, fieldValue)
			return fieldValue
		}
		return ''
	}, [field, mgr, editMode])
}
