/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ComponentProps } from '~types/ComponentProps'

export interface FormProps extends ComponentProps {
	onSubmit?: (args: any) => void
}
