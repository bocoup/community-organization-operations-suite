/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Operation, FetchResult, NextLink, DocumentNode } from '@apollo/client/link/core'
import { ApolloLink } from '@apollo/client/link/core'
import type { Observer } from '@apollo/client/utilities'
import { Observable } from '@apollo/client/utilities'
import { config } from '~utils/config'
import { getCurrentRequestQueue, getCurrentUser, setCurrentRequestQueue } from '~utils/localCrypto'

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
	private readonly isDurableCacheEnabled
	private currentUser: string

	constructor() {
		super()
		this.isDurableCacheEnabled = Boolean(config.features.durableCache.enabled)
		this.currentUser = getCurrentUser()
	}

	public getQueue(): OperationQueueEntry[] {
		if (this.isDurableCacheEnabled) {
			return this.combinedQueue()
		}
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

		let opQueueCopy = []
		if (this.isDurableCacheEnabled) {
			opQueueCopy = [...this.combinedQueue()]
			setCurrentRequestQueue('[]')
		} else {
			opQueueCopy = [...this.opQueue]
			this.opQueue = []
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
		if (this.isDurableCacheEnabled) {
			// ensure the queue gets persisted or retrieved if required
			if (this.hasUserChanged()) {
				this.opQueue = JSON.parse(getCurrentRequestQueue())
			} else {
				setCurrentRequestQueue(JSON.stringify(this.opQueue))
			}
		}

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
			setCurrentRequestQueue(JSON.stringify(this.opQueue))
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

	private combinedQueue(): OperationQueueEntry[] {
		const savedQueueS = getCurrentRequestQueue()
		if (savedQueueS) {
			const combined = this.opQueue.concat(JSON.parse(savedQueueS))
			setCurrentRequestQueue(JSON.stringify(combined))
			return combined.filter((item, index) => combined.indexOf(item) === index)
		} else {
			setCurrentRequestQueue(JSON.stringify(this.opQueue))
		}
		return this.opQueue
	}

	private hasUserChanged(): boolean {
		const currentUser = getCurrentUser()
		if (this.currentUser === currentUser) {
			return false
		}
		this.currentUser = currentUser
		return true
	}
}
