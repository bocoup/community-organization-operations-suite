/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Localization } from '~components/Localization'
import config from 'config'

export function getPasswordResetHTMLTemplate(
	password: string,
	locale: string,
	localization: Localization
): string {
	const contactUsEmail = config.get('email.contactUs')
	return `
        <html>
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style>
                    a, a:hover, a:active, a:visited, a:focus {
                        color: black;
                    }
                </style>
            </head>
            <body style="background-color: #F6F6F6; margin:0; width: 100%; height: 100%; font-family: 'Segoe UI', Roboto, Tahoma, Geneva, Verdana, sans-serif;">
                <div style="margin-left: auto; margin-right: auto; padding: 20px; width:580px; text-align: center;">
                    <div style="margin-top:0; margin-bottom:10px; padding:0; font-weight: normal; font-size: 36px; color: #007bd4">${localization.t(
											'mutation.resetUserPassword.emailHTML.header',
											locale
										)}</div>
                    <div style="color: #007bd4; font-size: 24px; font-weight: normal;">${localization.t(
											'mutation.resetUserPassword.emailHTML.subHeader',
											locale
										)}</div>
                    <div style="margin: 20px 0; border-radius: 10px; border: 1px solid #ccc; padding: 20px; background-color: #fff">
                        <div style="font-size: 24px; margin-bottom: 20px; color: #000;">${localization.t(
													'mutation.resetUserPassword.emailSubject',
													locale
												)}</div>
                        <div style="font-size: 14px; margin-bottom: 20px; color: #000;"><p>${localization.t(
													'mutation.resetUserPassword.emailHTML.body',
													locale
												)}</p></div>
                        <div style="font-size: 18px; margin-bottom: 20px; font-weight: 600; color: #007bd4">${password}</div>
                        <div style="font-size: 12px; margin-bottom: 20px; color: #000;"><p>${localization.t(
													'mutation.resetUserPassword.emailHTML.reminder',
													locale
												)}</p></div>
                    </div>
                    <div style="font-size: 12px;">
                        <div style="margin-bottom: 20px; color: #000">${localization.t(
													'mutation.resetUserPassword.emailHTML.doNotReply',
													locale
												)}</div>
                        <div style="margin-bottom: 5px; color: #000">${localization.t(
													'mutation.resetUserPassword.emailHTML.footers.sendFeedback',
													locale
												)} </div>
                        <div style="margin-bottom: 5px; color: #000"><a href='https://go.microsoft.com/fwlink/?LinkId=521839' target="_blank">${localization.t(
													'mutation.resetUserPassword.emailHTML.footers.privacyCookies',
													locale
												)}</a> | <a href='https://www.microsoft.com/trademarks' target="_blank">${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.tradeMarks',
		locale
	)}</a> | <a href='https://go.microsoft.com/fwlink/?LinkID=206977' target="_blank">${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.termsOfUse',
		locale
	)}</a> | <a href='${contactUsEmail}'>${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.contactUs',
		locale
	)}</a> | <a href='#'>${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.codeOfConduct',
		locale
	)}</a></div>
                        <div style="color: #000">©️ 2021 <a href='https://www.microsoft.com' target="_blank">Microsoft</a></div>
                    </div>
                </div>
            </body>
        </html>
    `
}

export function getAccountCreatedHTMLTemplate(
	loginLink: string,
	password: string,
	locale: string,
	localization: Localization
): string {
	return `
        <html>
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style>
                    a, a:hover, a:active, a:visited, a:focus {
                        color: black;
                    }
                </style>
            </head>
            <body style="background-color: #F6F6F6; margin:0; width: 100%; height: 100%; font-family: 'Segoe UI', Roboto, Tahoma, Geneva, Verdana, sans-serif;">
                <div style="margin-left: auto; margin-right: auto; padding: 20px; width:580px; text-align: center;">
                    <div style="margin-top:0; margin-bottom:10px; padding:0; font-weight: normal; font-size: 36px; color: #007bd4">${localization.t(
											'mutation.createNewUser.emailHTML.header',
											locale
										)}</div>
                    <div style="color: #007bd4; font-size: 24px; font-weight: normal;">${localization.t(
											'mutation.createNewUser.emailHTML.subHeader',
											locale
										)}</div>
                    <div style="margin: 20px 0; border-radius: 10px; border: 1px solid #ccc; padding: 20px; background-color: #fff">
                        <div style="font-size: 24px; margin-bottom: 20px; color: #000;">${localization.t(
													'mutation.createNewUser.emailSubject',
													locale
												)}</div>
                        <div style="font-size: 14px; margin-bottom: 20px; color: #000;"><p>${localization.t(
													'mutation.createNewUser.emailHTML.body',
													locale
												)}</p></div>
                        <div style="font-size: 18px; margin-bottom: 20px; font-weight: 600; color: #007bd4">${password}</div>
                        <div style="font-size: 18px; margin-bottom: 20px; font-weight: 600">
                            <a href='${loginLink}' target="_blank" style="text-decoration: none; padding: 10px; color: #fff; background-color: #0078d4">${localization.t(
		'mutation.createNewUser.emailHTML.clickHere',
		locale
	)}</a>
                        </div>
                        <div style="font-size: 12px; margin-bottom: 20px; color: #000;"><p>${localization.t(
													'mutation.createNewUser.emailHTML.reminder',
													locale
												)}</p></div>
                    </div>
                    <div style="font-size: 12px;">
                        <div style="margin-bottom: 20px; color: #000">${localization.t(
													'mutation.createNewUser.emailHTML.doNotReply',
													locale
												)}</div>
                        <div style="margin-bottom: 5px; color: #000">${localization.t(
													'mutation.createNewUser.emailHTML.footers.sendFeedback',
													locale
												)} <a href='mailto:intakeprototype@googlegroups.com'>intakeprototype@googlegroups.com</a></div>
                        <div style="margin-bottom: 5px; color: #000"><a href='https://go.microsoft.com/fwlink/?LinkId=521839' target="_blank">${localization.t(
													'mutation.createNewUser.emailHTML.footers.privacyCookies',
													locale
												)}</a> | <a href='https://www.microsoft.com/trademarks' target="_blank">${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.tradeMarks',
		locale
	)}</a> | <a href='https://go.microsoft.com/fwlink/?LinkID=206977' target="_blank">${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.termsOfUse',
		locale
	)}</a> | <a href='mailto:intakeprototype@googlegroups.com'>${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.contactUs',
		locale
	)}</a> | <a href='#'>${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.codeOfConduct',
		locale
	)}</a></div>
                        <div style="color: #000">©️ 2021 <a href='https://www.microsoft.com' target="_blank">Microsoft</a></div>
                    </div>
                </div>
            </body>
        </html>
    `
}

export function getForgotPasswordHTMLTemplate(
	resetLink: string,
	locale: string,
	localization: Localization
): string {
	const contactUsEmail = config.get('email.contactUs')
	return `
        <html>
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style>
                    a, a:hover, a:active, a:visited, a:focus {
                        color: black;
                    }
                </style>
            </head>
            <body style="background-color: #F6F6F6; margin:0; width: 100%; height: 100%; font-family: 'Segoe UI', Roboto, Tahoma, Geneva, Verdana, sans-serif;">
                <div style="margin-left: auto; margin-right: auto; padding: 20px; width:580px; text-align: center;">
                    <div style="margin-top:0; margin-bottom:10px; padding:0; font-weight: normal; font-size: 36px; color: #007bd4">${localization.t(
											'mutation.forgotUserPassword.emailHTML.header',
											locale
										)}</div>
                    <div style="color: #007bd4; font-size: 24px; font-weight: normal;">${localization.t(
											'mutation.forgotUserPassword.emailHTML.subHeader',
											locale
										)}</div>
                    <div style="margin: 20px 0; border-radius: 10px; border: 1px solid #ccc; padding: 20px; background-color: #fff">
                        <div style="font-size: 24px; margin-bottom: 20px; color: #000;">${localization.t(
													'mutation.forgotUserPassword.emailSubject',
													locale
												)}</div>
                        <div style="font-size: 14px; margin-bottom: 20px; color: #000;"><p>${localization.t(
													'mutation.forgotUserPassword.emailHTML.body',
													locale
												)}</p></div>
                        <div style="font-size: 18px; margin-bottom: 20px; font-weight: 600">
                            <a href='${resetLink}' target="_blank" style="text-decoration: none; padding: 10px; color: #fff; background-color: #0078d4">${localization.t(
		'mutation.forgotUserPassword.emailHTML.clickHere',
		locale
	)}</a>
                        </div>
                        <div style="font-size: 12px; margin-bottom: 20px; color: #000;"><p>${localization.t(
													'mutation.forgotUserPassword.emailHTML.reminder',
													locale
												)}</p></div>
                    </div>
                    <div style="font-size: 12px;">
                        <div style="margin-bottom: 20px; color: #000">${localization.t(
													'mutation.forgotUserPassword.emailHTML.doNotReply',
													locale
												)}</div>
                        <div style="margin-bottom: 5px; color: #000">${localization.t(
													'mutation.forgotUserPassword.emailHTML.footers.sendFeedback',
													locale
												)} </div>
                        <div style="margin-bottom: 5px; color: #000"><a href='https://go.microsoft.com/fwlink/?LinkId=521839' target="_blank">${localization.t(
													'mutation.forgotUserPassword.emailHTML.footers.privacyCookies',
													locale
												)}</a> | <a href='https://www.microsoft.com/trademarks' target="_blank">${localization.t(
		'mutation.forgotUserPassword.emailHTML.footers.tradeMarks',
		locale
	)}</a> | <a href='https://go.microsoft.com/fwlink/?LinkID=206977' target="_blank">${localization.t(
		'mutation.forgotUserPassword.emailHTML.footers.termsOfUse',
		locale
	)}</a> | <a href='${contactUsEmail}'>${localization.t(
		'mutation.forgotUserPassword.emailHTML.footers.contactUs',
		locale
	)}</a> | <a href='#'>${localization.t(
		'mutation.forgotUserPassword.emailHTML.footers.codeOfConduct',
		locale
	)}</a></div>
                        <div style="color: #000">©️ 2021 <a href='https://www.microsoft.com' target="_blank">Microsoft</a></div>
                    </div>
                </div>
            </body>
        </html>
    `
}
