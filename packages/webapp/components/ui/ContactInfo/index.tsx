/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import type ComponentProps from '~types/ComponentProps'
import type ContactInfoType from '~types/ContactInfo'

interface ContactInfoProps extends ComponentProps {
	contact?: ContactInfoType
}

export default function ContactInfo({ contact }: ContactInfoProps): JSX.Element {
	const { email, phone, street, state, zip } = contact

	return (
		<>
			{phone && (
				<span className='d-flex align-items-center mb-3'>
					<FontIcon iconName='CellPhone' className='me-3' />
					<a href={`tel:${phone}`}>{phone}</a>
				</span>
			)}
			{email && (
				<span className='d-flex align-items-center'>
					<FontIcon iconName='Mail' className='me-3' />
					<a href={`mailto:${email}`}>{email}</a>
				</span>
			)}
			{street && (
				<span className='d-flex align-items-start'>
					<FontIcon iconName='MapPin' className='me-3' />
					<div>
						<div>{street}</div>
						<div>
							{state && `${state}, `}
							{zip && zip.toString()}
						</div>
					</div>
				</span>
			)}
		</>
	)
}
