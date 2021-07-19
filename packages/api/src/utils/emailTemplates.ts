/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Localization } from '~components'
import config from 'config'

export function getPasswordResetHTMLTemplate(password: string, localization: Localization): string {
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
                    <div style="margin-top:0; margin-bottom:10px; padding:0; font-weight: normal; font-size: 36px; color: #2f9bed">${localization.t(
											'mutation.resetUserPassword.emailHTML.header'
										)}</div>
                    <div style="color: #2f9bed; font-size: 24px; font-weight: normal;">${localization.t(
											'mutation.resetUserPassword.emailHTML.subHeader'
										)}</div>
                    <div style="margin: 20px 0; border-radius: 10px; border: 1px solid #ccc; padding: 20px; background-color: #fff">
                        <div style="font-size: 24px; margin-bottom: 20px; color: #000;">${localization.t(
													'mutation.resetUserPassword.emailSubject'
												)}</div>
                        <div style="font-size: 14px; margin-bottom: 20px; color: #000;"><p>${localization.t(
													'mutation.resetUserPassword.emailHTML.body'
												)}</p></div>
                        <div style="font-size: 18px; margin-bottom: 20px; font-weight: 600; color: #2f9bed">${password}</div>
                        <div style="font-size: 12px; margin-bottom: 20px; color: #000;"><p>${localization.t(
													'mutation.resetUserPassword.emailHTML.reminder'
												)}</p></div>
                    </div>
                    <div style="font-size: 12px;">
                        <div style="margin-bottom: 20px; color: #000">${localization.t(
													'mutation.resetUserPassword.emailHTML.doNotReply'
												)}</div>
                        <div style="margin-bottom: 5px; color: #000">${localization.t(
													'mutation.resetUserPassword.emailHTML.footers.sendFeedback'
												)} </div>
                        <div style="margin-bottom: 5px; color: #000"><a href='https://go.microsoft.com/fwlink/?LinkId=521839' target="_blank">${localization.t(
													'mutation.resetUserPassword.emailHTML.footers.privacyCookies'
												)}</a> | <a href='https://www.microsoft.com/trademarks' target="_blank">${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.tradeMarks'
	)}</a> | <a href='https://go.microsoft.com/fwlink/?LinkID=206977' target="_blank">${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.termsOfUse'
	)}</a> | <a href='${contactUsEmail}'>${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.contactUs'
	)}</a> | <a href='#'>${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.codeOfConduct'
	)}</a></div>
                        <div style="color: #000">©️ 2021 <a href='https://www.microsoft.com' target="_blank">Microsoft</a></div>
                    </div>
                </div>
            </body>
        </html>
    `
}

export function getAccountCreatedHTMLTemplate(
	password: string,
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
                    <div style="margin-top:0; margin-bottom:10px; padding:0; font-weight: normal; font-size: 36px; color: #2f9bed">${localization.t(
											'mutation.createNewUser.emailHTML.header'
										)}</div>
                    <div style="color: #2f9bed; font-size: 24px; font-weight: normal;">${localization.t(
											'mutation.createNewUser.emailHTML.subHeader'
										)}</div>
                    <div style="margin: 20px 0; border-radius: 10px; border: 1px solid #ccc; padding: 20px; background-color: #fff">
                        <div style="font-size: 24px; margin-bottom: 20px; color: #000;">${localization.t(
													'mutation.createNewUser.emailSubject'
												)}</div>
                        <div style="font-size: 14px; margin-bottom: 20px; color: #000;"><p>${localization.t(
													'mutation.createNewUser.emailHTML.body'
												)}</p></div>
                        <div style="font-size: 18px; margin-bottom: 20px; font-weight: 600; color: #2f9bed">${password}</div>
                        <div style="font-size: 12px; margin-bottom: 20px; color: #000;"><p>${localization.t(
													'mutation.createNewUser.emailHTML.reminder'
												)}</p></div>
                    </div>
                    <div style="font-size: 12px;">
                        <div style="margin-bottom: 20px; color: #000">${localization.t(
													'mutation.createNewUser.emailHTML.doNotReply'
												)}</div>
                        <div style="margin-bottom: 5px; color: #000">${localization.t(
													'mutation.createNewUser.emailHTML.footers.sendFeedback'
												)} <a href='mailto:intakeprototype@googlegroups.com'>intakeprototype@googlegroups.com</a></div>
                        <div style="margin-bottom: 5px; color: #000"><a href='https://go.microsoft.com/fwlink/?LinkId=521839' target="_blank">${localization.t(
													'mutation.createNewUser.emailHTML.footers.privacyCookies'
												)}</a> | <a href='https://www.microsoft.com/trademarks' target="_blank">${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.tradeMarks'
	)}</a> | <a href='https://go.microsoft.com/fwlink/?LinkID=206977' target="_blank">${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.termsOfUse'
	)}</a> | <a href='mailto:intakeprototype@googlegroups.com'>${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.contactUs'
	)}</a> | <a href='#'>${localization.t(
		'mutation.resetUserPassword.emailHTML.footers.codeOfConduct'
	)}</a></div>
                        <div style="color: #000">©️ 2021 <a href='https://www.microsoft.com' target="_blank">Microsoft</a></div>
                    </div>
                </div>
            </body>
        </html>
    `
}
