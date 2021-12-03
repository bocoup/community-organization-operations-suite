/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import 'reflect-metadata'
import { config } from 'dotenv'

// configure environment
config()

import('./scripts/migrate')
