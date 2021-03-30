# Project Greenlight REST API

## Endpoints

`/api/orgs`

- Organizations are CBOs

`/api/orgs/{id}`

- Unassigned org?

`/api/orgs/{id}/contacts`

- View queue of contacts for this org

`/api/users`

- Users are Navigators, Admins, members of CBOs

`/api/users/{id}`

`/api/users/{id}/contacts`

- view queue of contacts for this user

`/api/contacts?status=<unassigned>` (basic intake form)

- Contacts are client dossiers, their public info, audit log

`/api/contacts/{id}`

`/api/contacts/{id}/assignments`

- active assignments with a non-closed status
- Assign to Organization Inbox (multi-assign possible)
  - Assign to Individual in Org (multi-assign possible)

`/api/contacts/{id}/comments`

- text comments regarding a contact

`/api/contacts/{id}/engagements`

- Record of engagements with CBOs and an individual contact, created from assignments when complete
  - Date, name of CBO, other fields may/may not be accessible per engagement

## Data Models

### Contact

```json
{
	"id": "<generated_id>",
	"data": {
		// Basic contact info - look up contact schema
		"first_name": "..",
		"last_name": "..",
		"contacts": [
			{ "phone": ".." },
			{ "instagram": ".." },
			{ "whatsapp": ".." }
		],
		"addresses": [
			{
				// address data
			}
		]
	},
	"additional_data": {
		"<org_id>": {
			// data hash - encrypted, differential access to view
		}
	},
	"engagements": ["engagement_url"]
}
```

### Comment

```json
{
	"id": "<generated_id>",
	"data": {
		"author": "user id",
		"timestamp": "<ISO 8601 timestamp>",
		"text": "this guy was a jerk"
	}
}
```

### Engagement

```json
{
	"id": "<generated_id>",
	"data": {
		// mandatory data
		"start_timestamp": "<ISO 8601 timestamp>",
		"end_timestamp": "<ISO 8601 timestamp>",
		"comments": "this guy was a jerk"
	},
	"additional_data": {
		// CBO DATA fields
		"shot_brand": "moderna"
	}
}
```

### Organization

```json
{
	"id": "<generated_id",
	"data": {
		"name": "Cureamericas"
	}
}
```
