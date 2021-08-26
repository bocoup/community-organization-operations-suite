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

Active development is performed in feature branches and synchronized into the `dev` branch as it stabilizes. When releases are ready for production, they are merged into the `main` branch.

Development Branches:
The following branch naming patterns are utilized for different kinds of efforts within the project. All branches should target the `dev` branch, except for `hotfix` branches, which may target both `dev` and `main`.

- Bugfixes: `fix/*`
- Features: `feature/*`
- Hotfix: `hotfix/*`
- CI: `ci/*`
- Documentation: `docs/*`
- Testing: `test/*`
- Refactoring: `refactor/*`

## Operations & Deployment

The [GitHub Actions CI](.github/workflows/ci.yml) workflow is used to automate the deployment of the app in accordance with the branching strategy described above. The infrastructure required for an instance of the application is:

1. A MongoDB compatible database. We use CosmosDB with MongoDB driver.
2. A NodeJS web-server environment for the [GraphQL API](packages/api).
3. A static website deployment (Azure Blob Storage/S3) for the [web application](packages/webapp). This may be CDN-hosted or self-hosted in static storage.
4. A SendGrid account for sending automated emails (e.g. password reset emails).
5. (_optional_) A Firebase account for In-App Notifications.

### Configuration

The application uses the [config](npm.im/config) package to manage configuration settings per hosted environment. The following environment variables may be defined to override configuration settings:

- API [environment variables](packages/api/config/custom-environment-variables.md)

  - **DB_CONNECTION_STRING** (_required_): The MongoDB connection string for the database.
  - **JWT_SECRET** (_strongly recommended_): A secret, random string used for salting JWT tokens.
  - **SENDGRID_API_KEY** (_required for email_): The SendGrid API key.
  - **EMAIL_FROM** (_required for email_): The email address used for sending automated emails.
  - **CONTACT_US_EMAIL** (_required for email_): The email address used for customer support.
  - **PORT** (_optional_): the port the application is running on. This is provided by default from the Azure App Service runtime.
  - **FIREBASE_AUTH_URI** (_optional_): The Firebase Auth URI for the Firebase account.
  - **FIREBASE_TOKEN_URI** (_optional_): The Firebase Token URI for the Firebase account.
  - **FIREBASE_AUTH_PROVIDER_X509_CERT_URL** (_optional_): The Firebase Auth Provider X509 Cert URL for the Firebase account.
  - **FIREBASE_TYPE** (_optional_): The Firebase type for the Firebase account.
  - **FIREBASE_PROJECT_ID** (_optional_): The Firebase project ID for the Firebase account.
  - **FIREBASE_PRIVATE_KEY_ID** (_optional_): The Firebase private key ID for the Firebase account.
  - **FIREBASE_PRIVATE_KEY** (_optional_): The Firebase private key for the Firebase account.
  - **FIREBASE_CLIENT_EMAIL** (_optional_): The Firebase client email for the Firebase account.
  - **FIREBASE_CLIENT_ID** (_optional_): The Firebase client ID for the Firebase account.
  - **FIREBASE_CLIENT_X509_CERT_URL** (_optional_): The Firebase client X509 Cert URL for the Firebase account.

- Web App [environment variables](packages/webapp/config/custom-environment-variables.md)
  - **API_URL** (_required_): The URL of the GraphQL API this webapp will communicate with.
  - **SOCKET_URL** (_required_): The URL of the sockets API this webapp will communicate with.
