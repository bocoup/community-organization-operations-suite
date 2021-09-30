/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

// Persona Dropdown Items
export const getPersonaButton = () =>
	document.querySelector(`[data-testid="persona"]`) as HTMLElement
export const getLogoutButton = () => document.querySelector('.logout-button') as HTMLElement

// Login Items
export const getEmailField = () =>
	document.querySelector(`[data-testid="login-email"]`) as HTMLInputElement
export const getConsentCheckbox = () => document.querySelector(`.ms-Checkbox-text`)
export const getPasswordField = () =>
	document.querySelector(`[data-testid="login-password"]`) as HTMLInputElement
export const getLoginButton = () => document.querySelector(`[data-testid="login-button"]`)

// Request List Page Items
export const getMyRequestsList = () => document.querySelector(`[data-testid="my-requests-list"]`)
export const getFlyoutPanels = () => document.querySelector(`[data-testid="flyout-panels"]`)
export const getRequestsList = () => document.querySelector(`[data-testid="requests-list"]`)
export const getInactiveRequestsList = () =>
	document.querySelector(`[data-testid="inactive-requests-list"]`)

// Services Page Items
export const getServiceList = () => document.querySelector(`[data-testid="service-list"]`)

// Specilist Page Items
export const getSpecialistList = () => document.querySelector(`[data-testid="specialist-list"]`)

// Clients Page
export const getContactList = () => document.querySelector(`[data-testid="contact-list"]`)

// Tags Page
export const getTagList = () => document.querySelector(`[data-testid="tags-list"]`)

// Reports Page
export const getReportList = () => document.querySelector(`[data-testid="report-list"]`)
