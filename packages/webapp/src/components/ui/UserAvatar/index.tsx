/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Persona, PersonaSize } from '@fluentui/react'
import { memo } from 'react'
import type { StandardFC } from '~types/StandardFC'
interface UserAvatarProps {
	avatar: string
	alt?: string
}

export const UserAvatar: StandardFC<UserAvatarProps> = memo(function UserAvatar({ avatar, alt }) {
	return <Persona imageUrl={avatar} size={PersonaSize.size100} imageAlt={alt} hidePersonaDetails />
})
