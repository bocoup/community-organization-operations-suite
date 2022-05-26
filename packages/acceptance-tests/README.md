# Community-Based Organization Operations Suite (CBO Suite)

The CBO Suite is a case-management web application that enables CBOs and members of CBOs to work together more effectively.

## Getting Started

### Prerequisites

- NodeJS LTS Release
- Yarn v1 global installation (`npm i -g yarn`)
- docker-compose OR a MongoDB connection string defined in the environment variable `DB_CONNECTION_STRING`.

If you are using GitHub Codespaces with the provided devcontainer, these prerequisites are provided.

To start the application:

    > yarn
    > yarn start:db // (optional) for local development
    > yarn assets:
    > yarn start:

## Before Development

To begin testing, run the following commands in the root of the project.

    > yarn install:playwright_deps

Now you can start running tests, there are two options for running tests, the first will act exactly as the CI will, the second will only work if a local copy of the project is currently running

If you'd like to run the code similar to the CI, run:

    > yarn acceptance:test

If you'd like to run the tests while you have a local copy of the project running, run:

    > cd /package/acceptance-tests
    > yarn pwrun

## Development

> **_Note:_** The following commands require the user to be in `/package/acceptance-tests` folder, make sure to

    > cd packages/acceptance-tests

We use playwright for all of our acceptance tests, the docs can be found here: https://playwright.dev/docs/intro

### Creating a simple test

If you haven't already, create a file ending with `.spec.ts` in the `test/specs/` directory

To make testing development easier for everyone, we can use playwrights build in codegen feature. To get started simply run

    > yarn codegen

You can then go though your entire testing steps and see what playwright generates for you. From there you may copy the code in the playwright window and paste it into your `.spec.ts` file.

### Running a specific test

Sometimes its useful to run a specific test. To do this simply run

    > yarn playwright test -g "YOUR_TEST_NAME"

## Debugging

### Headed mode

Headed mode will open a browser window and run the test in that window.

    > yarn playwright test -g "YOUR_TEST_NAME" --headed

### Debug mode

Debug mode will open a browser window, run the test in the browser, and put a breakpoint at the very beginning.

    > yarn playwright test -g "YOUR_TEST_NAME" --debug

### VSCode Extension

Playwright comes with a VSCode extension that can create, run and debug tests from within VSCode. The extension can be found here: https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright

> **_Note:_** Make sure you cd into `packages/acceptance-tests`, you may need to temporarily remove the
> `
> "workspaces": [

    "packages/*"

],
`line from the parent directory`package.json`file before running`npm i --save-dev @playwright/test`. Once installed you will need to open `packages/acceptance-tests` in a separate vscode window to allow for test debugging.

### Errors

When trying to run your tests, you may come across `TypeError: Cannot read properties of undefined (reading 'mode')`

The reason this is happening is because your test async function may look like this (note the `{ page }` attribute):

    test('test', async ({ page }) => {

To fix this issue, change your test to:

    import type { Page } from '@playwright/test'

    test.describe('test description', () => {
        let page: Page

        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage()
        })

        test.afterAll(async () => {
            await page.close()
        })

        test.describe('test description', () => {
            test('test', async () => {
                ...
            })
        })
    })
