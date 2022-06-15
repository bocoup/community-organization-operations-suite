/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LocalForageWrapper } from 'apollo3-cache-persist'
import * as CryptoJS from 'crypto-js'
import {
	getPwdHash,
	checkSalt,
	setPwdHash,
	setCurrentUser,
	getCurrentUser
} from '~utils/localCrypto'

export class LocalForageWrapperEncrypted extends LocalForageWrapper {
	constructor(
		storage: LocalForageInterface,
		user = 'inituser', // need a default uid and pwd to load.  Actual info will be stored after login.
		passwd = 'notusedbyusers'
	) {
		super(storage)
		checkSalt(user)
		setPwdHash(user, passwd)
		setCurrentUser(user)
	}

	getItem(key: string): Promise<string | null> {
		const currentUid = getCurrentUser()
		return super.getItem(currentUid.concat('-', key)).then((item) => {
			if (item != null && item.length > 0) {
				return this.decrypt(item, currentUid)
			}
			return null
		})
	}

	removeItem(key: string): Promise<void> {
		const currentUid = getCurrentUser()
		return super.removeItem(currentUid.concat('-', key))
	}

	setItem(key: string, value: string | object | null): Promise<void> {
		const currentUid = getCurrentUser()
		const secData = this.encrypt(value, currentUid)
		return super.setItem(currentUid.concat('-', key), secData)
	}

	// NOTE: this needs to be changed from the saved hash to a dynamic hash - in progress
	private encrypt(data, currentUid): string {
		const edata = CryptoJS.AES.encrypt(data, getPwdHash(currentUid)).toString()
		return edata
	}

	// NOTE: this needs to be changed from the saved hash to a dynamic hash - in progress
	private decrypt(cdata, currentUid): string {
		const dataBytes = CryptoJS.AES.decrypt(cdata, getPwdHash(currentUid))
		return dataBytes.toString(CryptoJS.enc.Utf8)
	}
}

interface LocalForageInterface {
	// Actual type definition: https://github.com/localForage/localForage/blob/master/typings/localforage.d.ts#L17
	getItem(key: string): Promise<string | null>
	setItem(key: string, value: string | object | null): Promise<string | object | null>
	removeItem(key: string): Promise<void>
}
