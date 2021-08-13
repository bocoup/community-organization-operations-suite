# Developing

This project is structured as a Yarn v2 monorepo. It utilizes [Project Essex's build tooling](https://github.com/microsoft/essex-alpha-build-infra), which includes our
configurations for prettier, eslint, and documentation linting.

# Prerequisites

> Node >= 14
> yarn v1 global installation (e.g. `npm i -g yarn`)

# Development Workflow

The first thing you should run is `yarn install`, which should be a quick operation that wires up your dependencies locally.

Packages generally adhere to the following top-level scripts:

`clean` - removes generated build artifact folders
`build` - assembles local assets, transpiles source
`start` - start up web servers (libraries are generally not started, as we use [publishConfig](https://yarnpkg.com/configuration/manifest/#publishConfig) to reference TS sources directly during development instead of transpiled variants in the dist/folder)
`test` - any local, non-unit-testing, testing that needs to occur per file. In our state plans this is validating rule validity, JSON schema adherence, etc..

The top level monorepo uses the following top-level scripts:
`ci` - this is used during the CI process to execute the full suite of transpilation, package testing, unit testing, and linting
`clean:` - cleans built artifacts out of the repository
`lint:` - runs prettier, eslint, and documentation linting across the entire monorepo
`test:` - runs per-package unit testing
`build:` - builds all of the packages
`build:schema` - builds the GraphQL shcema - necessary for starting the packages.
`start:` - starts up the local web application and API
