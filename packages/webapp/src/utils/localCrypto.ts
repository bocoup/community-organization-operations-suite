/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as bcrypt from 'bcryptjs'
import { useState } from 'react'

const APOLLO_KEY = '-apollo-cache-persist'
const SALT_KEY = '-hash-salt'
const SALT_ROUNDS = 12
const HASH_PWD_KEY = '-hash-pwd'
const CURRENT_USER_KEY = 'current-user'

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

export {
	setCurrentUser,
	getCurrentUser,
	checkSalt,
	setSalt,
	getSalt,
	setPwdHash,
	getPwdHash,
	APOLLO_KEY
}
