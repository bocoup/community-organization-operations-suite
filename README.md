# Community-Based Organization Operations Suite (CBO Suite)

The CBO Suite is a case-management web application that enables CBOs and members of CBOs to work together more effectively.

## Developing

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

### Branch & Release Strategy

Environments & Mapped Branches:

- `dev` branch: synchronized w/ integration environment.
- `staging` branch: synchronized w/ staging environment.
- `main` branch: synchronized w/ production & demo environments.

Active development is performed in feature branches and synchronized into the `dev` branch as it stabilizes. When a sprint completes, the `dev` branch is merged into the `staging` branch. When the release is approved, the `staging` branch will be merged into the `main`

Development Branches:
The following branch naming patterns are utilized for different kinds of efforts within the project. All branches should target the `dev` branch, except for `hotfix` branches, which may target both `dev` and `main`.

- Bugfixes: `fix/*`
- Features: `feature/*`
- Hotfix: `hotfix/*`
- CI: `ci/*`
- Documentation: `docs/*`
- Testing: `test/*`
- Refactoring: `refactor/*`

## Localization

The application is developed to support multiple locales. Text displayed to the user, either directly on the site or through emails (ex: password reset) will use the locale selected by the user to determine the language. To achieve this, all text displayed to the user must be read from asset files and must not be hardcoded in the application.

There are two places in the application where localized strings exist:

- [GraphQL API](packages/api)
- [Web Application](packages/webapp)

Both of those projects have a locales subfolder (src/locales). In turn, each supported locale will have a subfolder in the locale folder. The text to display is captured in JSON files structured by locale folder. The JSON files are heirarchical key -> value pairs that map keys to their display text values. For example, the following details basic text keys for the page title and account header.
```
{
  "pageTitle": "My Profile",
  "_pageTitle.comment": "Page title displayed in the browser tab",
  "account": {
    "header": {
      "title": "My Profile",
      "_title.comment": "Header title text",
      "userName": "Username",
      "_userName.comment": "Username field label",
      "userSince": "User since",
      "_userSince.comment": "User since field label",
      "numOfAssignedEngagements": "# of Currently Assigned Requests",
      "_numOfAssignedEngagements.comment": "# of Currently Assigned Requests for Assistance field label",
      "totalEngagementCompleted": "Total Requests Completed",
      "_totalEngagementCompleted.comment": "Total Requests Completed field label"
    }
  }
}
```
A few things to note from the above:
- `account.header.title` would be used in the application to display `My Profile`
- The keys starting with an _ and ending with `.comment` do not need to be translated as they are informational only

When it comes time to display text to the user, the application will use the specified locale to lookup the text to use by key. The locale will default to en-US if not otherwise specified. Furthermore, if a key does not exist for the specified locale, then the text will be taken from the en-US locale file.

To update the displayed text, it is sufficient to update the locale JSON files. Once these files have been updated and pushed to the appropriate branch, the updated text will be picked up by the application.

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
