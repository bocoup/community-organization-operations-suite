/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as bcrypt from 'bcryptjs'
import * as CryptoJS from 'crypto-js'
import { currentUserStore } from '~utils/current-user-store'

const APOLLO_KEY = '-apollo-cache-persist'
const SALT_KEY = '-hash-salt'
const SALT_ROUNDS = 12
const HASH_PWD_KEY = '-hash-pwd'
const CURRENT_USER_KEY = 'current-user'
const REQUEST_QUEUE_KEY = '-request-queue'
const PRE_QUEUE_REQUEST_KEY = '-pre-queue-request'
const VERIFY_TEXT = 'DECRYPT ME'
const VERIFY_TEXT_KEY = '-verify'
const PRE_QUEUE_LOAD_REQUIRED = 'pre-queue-load-required'
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

const setCurrentRequestQueue = (queue: string): boolean => {
	return setQueue(queue, REQUEST_QUEUE_KEY)
}

const setPreQueueRequest = (queue: any[]): boolean => {
	return setQueue(JSON.stringify(queue), PRE_QUEUE_REQUEST_KEY)
}

const setQueue = (queue: string, key: string): boolean => {
	const uid = getCurrentUser()
	if (uid && queue) {
		const hash = getPwdHash(uid)
		if (hash) {
			const edata = CryptoJS.AES.encrypt(queue, currentUserStore.state.sessionPassword).toString()
			window.localStorage.setItem(uid.concat(key), edata)
			return true
		}
	}
	return false
}

const getCurrentRequestQueue = (): string => {
	return getQueue(REQUEST_QUEUE_KEY)
}

const getPreQueueRequest = (): any[] => {
	const requests = getQueue(PRE_QUEUE_REQUEST_KEY)
	if (requests) {
		return JSON.parse(requests)
	}
	return []
}

const getQueue = (key: string): string => {
	const empty = '[]'
	const uid = getCurrentUser()
	if (uid) {
		const hash = getPwdHash(uid)
		if (hash) {
			const edata = window.localStorage.getItem(uid.concat(key))
			if (!edata) {
				setQueue(empty, key)
			} else {
				const sessionKey = currentUserStore.state.sessionPassword
				const dataBytes = CryptoJS.AES.decrypt(edata, sessionKey)
				return dataBytes.toString(CryptoJS.enc.Utf8)
			}
		}
	}
	return empty
}

const clearCurrentRequestQueue = (): boolean => {
	const uid = getCurrentUser()
	if (uid) {
		window.localStorage.removeItem(uid.concat(REQUEST_QUEUE_KEY))
		return true
	}
	return false
}

const clearPreQueueRequest = (): boolean => {
	const uid = getCurrentUser()

	if (uid) {
		window.localStorage.removeItem(uid.concat(PRE_QUEUE_REQUEST_KEY))
		return true
	}
	return false
}

const setPreQueueLoadRequired = (): void => {
	window.localStorage.setItem(PRE_QUEUE_LOAD_REQUIRED, 'true')
}

const clearPreQueueLoadRequired = (): void => {
	window.localStorage.setItem(PRE_QUEUE_LOAD_REQUIRED, 'false')
}

const getPreQueueLoadRequired = (): boolean => {
	const setting = window.localStorage.getItem(PRE_QUEUE_LOAD_REQUIRED)
	if (setting) {
		return setting === 'true'
	}
	return false
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
	getCurrentRequestQueue,
	setCurrentRequestQueue,
	clearCurrentRequestQueue,
	getPreQueueRequest,
	setPreQueueRequest,
	clearPreQueueRequest,
	setPreQueueLoadRequired,
	clearPreQueueLoadRequired,
	getPreQueueLoadRequired,
	APOLLO_KEY
}
