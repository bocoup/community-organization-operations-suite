# Community-Based Organization Operations Suite (CBO Suite)

The CBO Suite is a case-management web application that enables CBOs and members of CBOs to work together more effectively.

## Developing

### Prerequisites

- NodeJS LTS Release
- Yarn v1 global installation (`npm i -g yarn`)
- docker-compose OR a MongoDB connection string defined in the environment variable `DB_CONNECTION_STRING`

To begin developming the app locally:

If `DB_CONNECTION_STRING` environment variable is defined:

    > yarn build:schema
    > yarn start:

If using **docker-compose**

    -- Shell 1 --
    > yarn build:schema
    > yarn start:api:local

    -- Shell 2 --
    > yarn start:webapp

### Branch & Release Strategy

Environments & Mapped Branches:

- `dev` branch: synchronized w/ integration environment.
- `main` branch: synchronized w/ production environment.

Active development is performed in feature branches and synchronized into the `dev` 'branch as it stabilizes. When releases are ready for production, they are merged into the `main` branch.

Development Branches:
The following branch naming patterns are utilized for different kinds of efforts within the project. All branches should target the `dev` branch, except for `hotfix` branches, which may target both `dev` and `main`.

- Bugfixes: `fix/*`
- Features: `feature/*`
- Hotfix: `hotfix/*`
- CI: `ci/*`
- Documentation: `docs/*`
- Testing: `test/*`
- Refactoring: `refactor/*`

## Operations

### Configuration

### External Dependencies

- Firebase
- Sendgrid
