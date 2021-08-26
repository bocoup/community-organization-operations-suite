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
