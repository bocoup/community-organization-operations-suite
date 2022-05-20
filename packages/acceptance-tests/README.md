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

All these commands require the user to be in `/package/acceptance-tests` folder, make sure to

    > cd package/acceptance-tests

Now you can start running tests, simply run

    > yarn pwrun

## Development

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

> **_Note:_** To get the extension to work, you may need to open `/package/acceptance-tests` in a separate vscode window and run the `Install Playwright` command. Do not override the `playwright.config.ts` file and delete the generated `/tests/` directory and included `example.spec.ts` file.
