/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FetchResult } from '@apollo/client'
import { GraphQLError } from 'graphql'
import { MessageResponse, StatusType } from '~hooks/api'
import { ToastHandle } from '~hooks/useToasts'
import { createLogger } from './createLogger'

const logger = createLogger('handleGraphQLResponse')

export type MessageGenerator<T> = (res: T) => string

export interface HandleGraphqlResponseOptions<T> {
	/**
	 * The toast provider. If not present, no toast messages are shown
	 */
	toast?: ToastHandle

	/**
	 * The success toast message to show
	 */
	successToast?: string | MessageGenerator<T>

	/**
	 * The failure toast message to show
	 */
	failureToast?: string | MessageGenerator<readonly GraphQLError[]>

	/**
	 * Handles response success. Returns the success message string component of MessageResponse.
	 */
	onSuccess?: MessageGenerator<T>

	/**
	 * Handles response failure. Returns the failure message string component of MessageResponse.
	 */
	onError?: (res: T, errors: readonly GraphQLError[]) => string
}

export async function handleGraphqlResponse<T>(
	fetchPromise: Promise<FetchResult<T>>,
	opts: HandleGraphqlResponseOptions<T>
): Promise<MessageResponse> {
	return handleGraphqlResponseSync(await fetchPromise, opts)
}

export function handleGraphqlResponseSync<T>(
	res: FetchResult<T>,
	{ toast, successToast, failureToast, onSuccess, onError }: HandleGraphqlResponseOptions<T>
): MessageResponse {
	try {
		if (res.errors) {
			logger('graphql response indicates failure', res)
			if (toast && failureToast) {
				toast.failure(getMessage(failureToast, res.errors))
			}
			return failureResult(onError ? onError(res.data, res.errors) : res.errors[0].message)
		} else {
			if (toast && successToast) {
				toast.success(getMessage(successToast, res.data))
			}
			return successResult(onSuccess ? onSuccess(res.data) : null)
		}
	} catch (e) {
		logger('error handling graphql response', e)
		toast.failure(
			typeof failureToast === 'string' ? failureToast : 'Error handling server response',
			e
		)
		return failureResult(e.message)
	}
}

function getMessage<T>(msg: string | MessageGenerator<T>, data: T): string {
	return typeof msg === 'string' ? msg : msg(data)
}

function successResult(message?: string | null | undefined): MessageResponse {
	return { status: StatusType.Success, message }
}

function failureResult(message?: string | null | undefined): MessageResponse {
	return { status: StatusType.Failed, message }
}
