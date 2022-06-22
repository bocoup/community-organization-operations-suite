/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as bcrypt from 'bcryptjs'
import * as CryptoJS from 'crypto-js'

const APOLLO_KEY = '-apollo-cache-persist'
const SALT_KEY = '-hash-salt'
const SALT_ROUNDS = 12
const HASH_PWD_KEY = '-hash-pwd'
const CURRENT_USER_KEY = 'current-user'
const VERIFY_TEXT = 'DECRYPT ME'
const VERIFY_TEXT_KEY = '-verify'
/**
 * Check if a salt value has been stored for the given user. Each user will need a salt value to generate an encrypted
 * password that will be stored in the session to allow decryption of the apollo persistent cache.
 *  If the salt doesn't exist, create it and return false (indicating the data will be purged).
 *  If the salt does exist, return true (indicating the client may use the existing salt).
 *
 * @param userid
 *
 * @returns boolean - value that indicates if the salt had to be created (false) or exists (true)
 */
const checkSalt = (userid: string): boolean => {
	if (userid) {
		const saltKey = userid.concat(SALT_KEY)
		const salt = window.localStorage.getItem(saltKey)

		if (!salt) {
			const saltNew = bcrypt.genSaltSync(SALT_ROUNDS)
			setSalt(saltKey, saltNew)

			return false
		}
		return true
	}
	return false
}

const setSalt = (saltKey: string, value: string) => {
	window.localStorage.setItem(saltKey, value)
}

const getSalt = (saltKey: string): string | void => {
	return window.localStorage.getItem(saltKey)
}

const setPwdHash = (uid: string, pwd: string): boolean => {
	if (uid) {
		const salt = getSalt(uid.concat(SALT_KEY))
		if (!salt) {
			return false
		}
		const hashPwd = bcrypt.hashSync(pwd, salt)
		window.localStorage.setItem(uid.concat(HASH_PWD_KEY), hashPwd)

		const edata = CryptoJS.AES.encrypt(VERIFY_TEXT, getPwdHash(uid)).toString()
		window.localStorage.setItem(uid.concat(VERIFY_TEXT_KEY), edata)
		return true
	}
	return false
}

const testPassword = (uid: string, passwd: string) => {
	const currentPwdHash = getPwdHash(uid)
	const edata = window.localStorage.getItem(uid.concat(VERIFY_TEXT_KEY))
	if (!currentPwdHash || !edata) {
		return false
	}

	const dataBytes = CryptoJS.AES.decrypt(edata, currentPwdHash)
	const data = dataBytes.toString(CryptoJS.enc.Utf8)

	if (data !== VERIFY_TEXT) {
		return false
	}
	return true
}

const getPwdHash = (uid: string): string => {
	return window.localStorage.getItem(uid.concat(HASH_PWD_KEY))
}

const getCurrentUser = (): string => {
	return window.localStorage.getItem(CURRENT_USER_KEY)
}

const setCurrentUser = (uid: string) => {
	window.localStorage.setItem(CURRENT_USER_KEY, uid)
}

const clearUser = (uid: string): void => {
	window.localStorage.removeItem(uid.concat(VERIFY_TEXT_KEY))
	window.localStorage.removeItem(uid.concat(HASH_PWD_KEY))
	window.localStorage.removeItem(uid.concat(SALT_KEY))
}

export {
	setCurrentUser,
	getCurrentUser,
	checkSalt,
	setSalt,
	getSalt,
	setPwdHash,
	getPwdHash,
	testPassword,
	clearUser,
	APOLLO_KEY
}
