/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Service,
	ServiceCustomField,
	ServiceFieldAnswerInput
} from '@cbosuite/schema/dist/client-types'
import { useEffect, useMemo } from 'react'
import { empty } from '~utils/noop'

export class FormFieldManager {
	private _values: ServiceFieldAnswerInput = {}
	private _service: Service | null = null
	private _errors = new Map<string, string>()

	public get service(): Service {
		return this._service
	}

	public set service(service: Service) {
		this._service = service
	}

	public get values(): ServiceFieldAnswerInput {
		return this._values
	}

	public addFieldError(fieldId: string, errorMessage: string) {
		this._errors.set(fieldId, errorMessage)
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
		const fields = this.service?.customFields || empty
		const values = this.values
		let isValid = true

		fields.forEach((field) => {
			if (
				isRequired(field) &&
				(!values[field.fieldType] ||
					values[field.fieldType].some(
						(f) => !f.values || f.values.length === 0 || f.values === ''
					))
			) {
				isValid = false
			} else {
			}
		})

		const isValidContacts = this.service.contactFormEnabled ? values['contacts']?.length > 0 : true
		return isValid && isValidContacts
	}

	public saveFieldValue(field: ServiceCustomField, value: any) {
		const values = this.values
		if (!values[field.fieldType]) {
			values[field.fieldType] = [{ fieldId: field.fieldId, values: value }]
		} else {
			const index = values[field.fieldType].findIndex((f) => f.fieldId === field.fieldId)
			if (index === -1) {
				values[field.fieldType].push({ fieldId: field.fieldId, values: value })
			} else {
				values[field.fieldType][index].values = value
			}
		}
	}

	public saveFieldMultiValue(field: ServiceCustomField, value: any, upsertValue: boolean) {
		const values = this.values
		if (!values[field.fieldType]) {
			values[field.fieldType] = [{ fieldId: field.fieldId, values: [value.id] }]
		} else {
			const index = values[field.fieldType].findIndex((f) => f.fieldId === field.fieldId)
			if (index === -1) {
				values[field.fieldType].push({ fieldId: field.fieldId, values: [value.id] })
			} else {
				if (upsertValue) {
					values[field.fieldType][index].values = [
						...(values[field.fieldType][index].values ?? []),
						value.id
					]
				} else {
					values[field.fieldType][index].values = values[field.fieldType][index].values.filter(
						(v) => v !== value.id
					)
				}
			}
		}
	}

	public isSubmitEnabled() {
		return this.validateRequiredFields() && this._errors.size === 0
	}
}

const isRequired = (field: ServiceCustomField) => field.fieldRequirements === 'required'

export function useFormFieldManager(service: Service): FormFieldManager {
	const mgr = useMemo(() => new FormFieldManager(), [])
	useEffect(() => {
		mgr.service = service
	}, [service, mgr])
	return mgr
}
