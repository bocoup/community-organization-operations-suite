/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as bcrypt from 'bcryptjs'
import * as CryptoJS from 'crypto-js'
import { currentUserStore } from '~utils/current-user-store'
import type { User } from '@cbosuite/schema/dist/client-types'

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
const USER_KEY = '-user'
const ACCESS_TOKEN_KEY = '-access-token'

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

const getPwdHash = (uid: string): string => {
	return window.localStorage.getItem(uid.concat(HASH_PWD_KEY))
}

const testPassword = (uid: string, passwd: string) => {
	const currentPwdHash = getPwdHash(uid)

	const salt = getSalt(uid.concat(SALT_KEY))
	if (!currentPwdHash || !salt) {
		return false
	}
	const encryptedPasswd = bcrypt.hashSync(passwd, salt)

	return encryptedPasswd === currentPwdHash
}

const getCurrentUserId = (): string => {
	return window.localStorage.getItem(CURRENT_USER_KEY)
}

const setCurrentUserId = (uid: string) => {
	window.localStorage.setItem(CURRENT_USER_KEY, uid)
}

const getUser = (userId: string): string => {
	const currentPwdHash = getPwdHash(userId)
	const encryptedUser = window.localStorage.getItem(userId.concat(USER_KEY))
	const dataBytes = CryptoJS.AES.decrypt(encryptedUser, currentPwdHash)
	const user = dataBytes.toString(CryptoJS.enc.Utf8)

	return user
}

const setUser = (userId: string, user: User) => {
	const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), getPwdHash(userId)).toString()
	window.localStorage.setItem(userId.concat(USER_KEY), encryptedUser)
}

const getAccessToken = (userId: string): string => {
	if (!userId) {
		return null
	}
	const currentPwdHash = getPwdHash(userId)
	const encryptedAccessToken = window.localStorage.getItem(userId.concat(ACCESS_TOKEN_KEY))

	if (!currentPwdHash || !encryptedAccessToken) {
		return null
	}
	const dataBytes = CryptoJS.AES.decrypt(encryptedAccessToken, currentPwdHash)
	const accessToken = dataBytes.toString(CryptoJS.enc.Utf8)

	return accessToken
}

const setAccessToken = (userId: string, accessToken: string) => {
	const encryptedAccessToken = CryptoJS.AES.encrypt(accessToken, getPwdHash(userId)).toString()
	window.localStorage.setItem(userId.concat(ACCESS_TOKEN_KEY), encryptedAccessToken)
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
	const uid = getCurrentUserId()
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
	const uid = getCurrentUserId()
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
	const uid = getCurrentUserId()
	if (uid) {
		window.localStorage.removeItem(uid.concat(REQUEST_QUEUE_KEY))
		return true
	}
	return false
}

const clearPreQueueRequest = (): boolean => {
	const uid = getCurrentUserId()

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
	setCurrentUserId,
	getCurrentUserId,
	getUser,
	setUser,
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
	getAccessToken,
	setAccessToken,
	APOLLO_KEY
}
