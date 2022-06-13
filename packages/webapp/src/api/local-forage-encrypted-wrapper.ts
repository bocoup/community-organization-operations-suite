/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LocalForageWrapper } from 'apollo3-cache-persist'
import * as CryptoJS from 'crypto-js'
import * as bcrypt from 'bcryptjs'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('cache')

export class LocalForageWrapperEncrypted extends LocalForageWrapper {
	private hashPwd: string
	private salt: string
	private readonly uid: string
	private readonly ROUNDS: number = 12
	private readonly hashSaltKey: string
	private readonly APOLLO_KEY = 'apollo-cache-persist'
	private readonly SALT_KEY = '-hash-salt'

	constructor(
		storage: LocalForageInterface,
		user = 'testuser',
		passwd = 'supersecret'
	) {
		super(storage)
		this.uid = user
		this.hashSaltKey = user.concat(this.SALT_KEY)
		this.checkHash(passwd)
	}

	getItem(key: string): Promise<string | null> {
		return super.getItem(this.uid.concat('-', key)).then((item) => {
			if (item != null && item.length > 0) {
				return this.decrypt(item)
			}
			return null
		})
	}

	removeItem(key: string): Promise<void> {
		return super.removeItem(this.uid.concat('-', key))
	}

	setItem(key: string, value: string | object | null): Promise<void> {
		const secData = this.encrypt(value)
		return super.setItem(this.uid.concat('-', key), secData)
	}

	private checkHash(passwd: string): void {
		this.salt = window.localStorage.getItem(this.hashSaltKey)
		if (!this.salt) {
			this.salt = bcrypt.genSaltSync(this.ROUNDS)
			window.localStorage.setItem(this.hashSaltKey, this.salt)
			this.hashPwd = bcrypt.hashSync(passwd, this.salt)

			this.removeItem(this.uid.concat('-', this.APOLLO_KEY)).then(() => {
				logger(`LOCAL CACHE CLEARED for ${this.uid}`)
			})
		} else {
			this.hashPwd = bcrypt.hashSync(passwd, this.salt)
		}
	}

	private encrypt(data): string {
		const edata = CryptoJS.AES.encrypt(data, this.hashPwd).toString()
		return edata
	}

	private decrypt(cdata): string {
		const dataBytes = CryptoJS.AES.decrypt(cdata, this.hashPwd)
		return dataBytes.toString(CryptoJS.enc.Utf8)
	}
}

interface LocalForageInterface {
	// Actual type definition: https://github.com/localForage/localForage/blob/master/typings/localforage.d.ts#L17
	getItem(key: string): Promise<string | null>
	setItem(key: string, value: string | object | null): Promise<string | object | null>
	removeItem(key: string): Promise<void>
}
