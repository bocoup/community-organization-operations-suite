/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	AuthenticationResponse,
	ContactResponse,
	Engagement,
	EngagementResponse,
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

export class SuccessResponse {
	public constructor(private _message: string) {}

	public get message() {
		return this._message
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
	public constructor(message: string, public user: User, public accessToken: string | null) {
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
