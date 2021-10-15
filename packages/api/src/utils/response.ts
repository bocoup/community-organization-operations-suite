/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	AuthenticationResponse,
	ContactResponse,
	Engagement,
	EngagementResponse,
	StatusType,
	User,
	VoidResponse,
	Contact,
	TagResponse,
	Tag,
	UserResponse,
	ServiceAnswerResponse,
	ServiceAnswer,
	Service,
	ServiceResponse
} from '@cbosuite/schema/dist/provider-types'

export class BaseResponse {
	public constructor(private _message: string, private _status: StatusType) {}

	public get message() {
		return this._message
	}

	public get status() {
		return this._status
	}
}

export class SuccessResponse extends BaseResponse {
	public constructor(message: string) {
		super(message, StatusType.Success)
	}
}

export class FailedResponse extends BaseResponse {
	public constructor(message: string) {
		super(message, StatusType.Failed)
	}
}

export class SuccessVoidResponse extends SuccessResponse implements VoidResponse {
	public constructor(message: string) {
		super(message)
	}
}

export class SuccessEngagementResponse extends SuccessResponse implements EngagementResponse {
	public constructor(message: string, public engagement: Engagement) {
		super(message)
	}
}

export class SuccessAuthenticationResponse
	extends SuccessResponse
	implements AuthenticationResponse
{
	public constructor(message: string, public user: User, public token: string | null) {
		super(message)
	}
}
export class SuccessContactResponse extends SuccessResponse implements ContactResponse {
	public constructor(message: string, public contact: Contact) {
		super(message)
	}
}

export class SuccessTagResponse extends SuccessResponse implements TagResponse {
	public constructor(message: string, public tag: Tag) {
		super(message)
	}
}

export class SuccessUserResponse extends SuccessResponse implements UserResponse {
	public constructor(message: string, public user: User) {
		super(message)
	}
}

export class SuccessServiceAnswerResponse extends SuccessResponse implements ServiceAnswerResponse {
	public constructor(message: string, public serviceAnswer: ServiceAnswer) {
		super(message)
	}
}

export class SuccessServiceResponse extends SuccessResponse implements ServiceResponse {
	public constructor(message: string, public service: Service) {
		super(message)
	}
}
