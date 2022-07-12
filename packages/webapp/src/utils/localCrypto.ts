/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as bcrypt from 'bcryptjs'
import * as CryptoJS from 'crypto-js'
import type { User } from '@cbosuite/schema/dist/client-types'

const APOLLO_KEY = '-apollo-cache-persist'
const SALT_KEY = '-hash-salt'
const SALT_ROUNDS = 12
const HASH_PWD_KEY = '-hash-pwd'
const CURRENT_USER_KEY = 'current-user'
const VERIFY_TEXT = 'DECRYPT ME'
const VERIFY_TEXT_KEY = '-verify'
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
	const saltKey = userid.concat(SALT_KEY)
	const salt = window.localStorage.getItem(saltKey)

	if (!salt) {
		const saltNew = bcrypt.genSaltSync(SALT_ROUNDS)
		setSalt(saltKey, saltNew)

		return false
	}
	return true
}

const setSalt = (saltKey: string, value: string) => {
	window.localStorage.setItem(saltKey, value)
}

const getSalt = (saltKey: string): string | void => {
	return window.localStorage.getItem(saltKey)
}

const setPwdHash = (uid: string, pwd: string): boolean => {
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
	getAccessToken,
	setAccessToken,
	APOLLO_KEY
}
