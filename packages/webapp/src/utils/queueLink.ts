/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Operation, FetchResult, NextLink, DocumentNode } from '@apollo/client/link/core'
import { ApolloLink } from '@apollo/client/link/core'
import type { Observer } from '@apollo/client/utilities'
import { Observable } from '@apollo/client/utilities'
import { config } from '~utils/config'
import localForage from 'localforage'
import { LocalForageWrapperEncrypted } from '../api/local-forage-encrypted-wrapper'
import { getCurrentUser } from '~utils/localCrypto'

export interface OperationQueueEntry {
	operation: Operation
	forward: NextLink
	observer: Observer<FetchResult>
	subscription?: { unsubscribe: () => void }
}

type OperationTypeNode = 'query' | 'mutation' | 'subscription'

export default class QueueLink extends ApolloLink {
	static listeners: Record<string, ((entry: any) => void)[]> = {}
	static filter: OperationTypeNode[] = null
	private opQueue: OperationQueueEntry[] = []
	private isOpen = true
	private readonly isDurableCacheEnabled: boolean
	private readonly localForageSecureKey = 'offline-request'
	private readonly currentUser
	private localForageSecure: LocalForageWrapperEncrypted

	constructor() {
		super()
		this.isDurableCacheEnabled = Boolean(config.features.durableCache.enabled)
		if (this.isDurableCacheEnabled) {
			this.currentUser = getCurrentUser()
			this.localForageSecure = new LocalForageWrapperEncrypted(localForage, this.currentUser)
			this.localForageSecure.getItem(this.localForageSecureKey).then((item) => {
				if (item) {
					this.opQueue = JSON.parse(item)
				}
			})
		}
	}

	public getQueue(): OperationQueueEntry[] {
		return this.opQueue
	}

	public isType(query: DocumentNode, type: OperationTypeNode): boolean {
		return (
			query.definitions.filter((e) => {
				return (e as any).operation === type
			}).length > 0
		)
	}

	private isFilteredOut(operation: Operation): boolean {
		if (!QueueLink.filter || !QueueLink.filter.length) return false
		return (
			operation.query.definitions.filter((e) => {
				return QueueLink.filter.includes((e as any).operation)
			}).length > 0
		)
	}

	public open() {
		this.isOpen = true
		const opQueueCopy = [...this.opQueue]
		this.opQueue = []
		if (this.isDurableCacheEnabled) {
			this.localForageSecure.removeItem(this.localForageSecureKey)
		}

		opQueueCopy.forEach(({ operation, forward, observer }) => {
			const key: string = QueueLink.key(operation.operationName, 'dequeue')
			if (key in QueueLink.listeners) {
				QueueLink.listeners[key].forEach((listener) => {
					listener({ operation, forward, observer })
				})
			}
			const keyAny: string = QueueLink.key('any', 'dequeue')
			if (keyAny in QueueLink.listeners) {
				QueueLink.listeners[keyAny].forEach((listener) => {
					listener({ operation, forward, observer })
				})
			}
			forward(operation).subscribe(observer)
		})
	}

	public static addLinkQueueEventListener = (
		opName: string,
		event: 'dequeue' | 'enqueue',
		listener: (entry: any) => void
	) => {
		const key: string = QueueLink.key(opName, event)

		const newListener = {
			[key]: [...(key in QueueLink.listeners ? QueueLink.listeners[key] : []), ...[listener]]
		}

		QueueLink.listeners = { ...QueueLink.listeners, ...newListener }
	}

	public static setFilter = (filter: OperationTypeNode[]) => {
		QueueLink.filter = filter
	}

	private static key(op: string, ev: string) {
		return `${op}${ev}`.toLocaleLowerCase()
	}

	public close() {
		this.isOpen = false
	}

	public request(operation: Operation, forward: NextLink) {
		if (this.isOpen) {
			return forward(operation)
		}
		if (operation.getContext().skipQueue) {
			return forward(operation)
		}
		if (this.isFilteredOut(operation)) {
			return forward(operation)
		}
		return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
			const operationEntry = { operation, forward, observer }
			this.enqueue(operationEntry)
			return () => this.cancelOperation(operationEntry)
		})
	}

	private cancelOperation(entry: OperationQueueEntry) {
		this.opQueue = this.opQueue.filter((e) => e !== entry)
	}

	private enqueue(entry: OperationQueueEntry) {
		this.opQueue.push(entry)
		if (this.isDurableCacheEnabled) {
			this.localForageSecure.setItem(this.localForageSecureKey, JSON.stringify(this.opQueue))
		}

		const key: string = QueueLink.key(entry.operation.operationName, 'enqueue')
		if (key in QueueLink.listeners) {
			QueueLink.listeners[key].forEach((listener) => {
				listener(entry)
			})
		}

		const keyAny: string = QueueLink.key('any', 'enqueue')
		if (keyAny in QueueLink.listeners) {
			QueueLink.listeners[keyAny].forEach((listener) => {
				listener(entry)
			})
		}
	}
}
