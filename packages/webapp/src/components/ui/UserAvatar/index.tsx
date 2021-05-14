/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Persona, PersonaSize } from '@fluentui/react'
import type ComponentProps from '~types/ComponentProps'
interface UserAvatarProps extends ComponentProps {
	avatar: string
	alt?: string
}

export default function UserAvatar({ avatar, alt }: UserAvatarProps): JSX.Element {
	return <Persona imageUrl={avatar} size={PersonaSize.size100} imageAlt={alt} hidePersonaDetails />
}
