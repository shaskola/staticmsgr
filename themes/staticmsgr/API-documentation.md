```markdown:@API-Documentation.md
# Messenger Database API Documentation

## Introduction
The Messenger database provides an easy way to integrate the data with any external system. The API follows REST semantics, uses JSON to encode objects and relies on standard HTTP codes, machine and human readable errors to signal operation outcomes.

This documentation is generated automatically based on the tables and fields that are in your database. If you make changes to your database, table or fields it could be that the API interface has also changed. Therefore, make sure that you update your API implementation accordingly.

Database ID: `111`

## Authentication
Baserow uses simple token-based authentication. You need to generate at least one database token in your settings to use the endpoints. It's possible to give create, read, update and delete permissions up until table level per token. You can authenticate to the API by providing your token in the HTTP authorization bearer token header. All API requests must be authenticated and made over HTTPS.

### Example Request
curl \
-H "Authorization: Token YOUR_DATABASE_TOKEN" \
"https://showcase.newhideaway.com"

## Messages Table (id: 736)

### Fields

| ID | Name | Type | Description |
|----|------|------|-------------|
| field_6129 | ID | autonumber | A read-only field that automatically increments a number for each new row |
| field_6131 | linkedtable | array | Accepts an array containing identifiers or main field text values of related rows from table id 737 |
| field_6132 | Image | array | Accepts an array of objects containing file names |
| field_6133 | button 1 text | string | Accepts single line text |
| field_6134 | button 2 text | string | Accepts single line text |
| field_6135 | button 3 text | string | Accepts single line text |
| field_6136 | button1 | boolean | Accepts a boolean |
| field_6137 | button2 | boolean | Accepts a boolean |
| field_6138 | button3 | boolean | Accepts a boolean |
| field_6139 | Send-Date | date | Accepts a date in ISO format |
| field_6145 | Posted | boolean | Accepts a boolean |
| field_6147 | character | array | Read-only field connected to linked table |
| field_6148 | avatar | array | Read-only field connected to linked table |
| field_6149 | message | string | Accepts multi line text with optional markdown formatting |
| field_6474 | msgType | integer or string | Accepts an integer or a text value representing the chosen select option id or option value. A null value means none is selected.

### Message Types
The msgType field (field_6474) supports the following values:
- 4724: secret
- 4727: system


### Field Properties

- **id**: `integer` - Field primary key (prefix with `field_`)
- **name**: `string` - Field name
- **table_id**: `integer` - Related table id
- **order**: `integer` - Field order in table (0 for first field)
- **primary**: `boolean` - Indicates if field is primary
- **type**: `string` - Type defined for this field
- **read_only**: `boolean` - Indicates if field is read only
- **description**: `string` - Field description

### List Fields Endpoint
GET https://showcase.newhideaway.com/api/database/fields/table/736/

### List Rows Endpoint
GET https://showcase.newhideaway.com/api/database/rows/table/736/

## Filters

| Filter | Example value | Full example |
|--------|--------------|--------------|
| input | string | `field: string` |
| ne_input | string | `field: ne: string` |
| like_a | UTC/Timestamp | `field: like: UTC/Timestamp` |
| like_in_list | UTC/Timestamp | `field: like: in: UTC/Timestamp` |
| like_a_values | UTC/Timestamp | `field: like: a: UTC/Timestamp` |
| like_in_a_values | UTC/Timestamp | `field: like: in: a: UTC/Timestamp` |
| like_in_all_like | UTC/Timestamp | `field: like: in: all: UTC/Timestamp` |
| like_in_any | UTC/Timestamp | `field: like: in: any: UTC/Timestamp` |
| like_in_date | 2023-01-01 | `field: like: date: 2023-01-01` |
| date_not_exists | UTC | `field: date: exists: UTC` |
| date_before_exists | UTC | `field: before: exists: UTC` |
| date_after_exists | UTC | `field: after: exists: UTC` |
| date_after_date | timestamp/format01 | `field: after: date: timestamp/format01` |
| date_before_exists | timestamp/format01 | `field: before: exists: timestamp/format01` |
| date_before_date | timestamp/format01 | `field: before: date: timestamp/format01` |
| date_equals_date_date | timestamp/format01 | `field: equals: date: timestamp/format01` |
| date_equals_exists_age | timestamp/format01 | `field: equals: exists: age: timestamp/format01` |
| date_equals_years_age | timestamp/format01 | `field: equals: years: age: timestamp/format01` |
| date_equals_exists | UTC | `field: equals: exists: UTC` |
| date_equals_months | UTC | `field: equals: months: UTC` |
| date_equals_year | UTC | `field: equals: year: UTC` |
| date_equals_day_of_week | 1 | `field: equals: day: of: week: 1` |
| date_before | 2023-01-01 | `field: before: date: 2023-01-01` |
| date_before_or_equal | 2023-01-01 | `field: before: or: equal: date: 2023-01-01` |
| date_after | 2023-01-01 | `field: after: date: 2023-01-01` |
| date_after_or_equal | 2023-01-01 | `field: after: or: equal: date: 2023-01-01` |
| text_after_date_age | string | `field: after: date: age: string` |
| has_prefix_exists | string | `field: prefix: exists: string` |
| has_not_prefix_date | string | `field: not: prefix: date: string` |
| has_not_prefix | string | `field: not: prefix: string` |
| has_not_value_exists | string | `field: not: value: exists: string` |
| has_value_contains | string | `field: value: contains: string` |
| has_not_value_contains | string | `field: not: value: contains: string` |
| has_not_contains_word | string | `field: not: contains: word: string` |
| has_value_length_is_equal_to | string | `field: value: length: is: equal: to: string` |
| contains | string | `field: contains: string` |
| contains_not | string | `field: contains: not: string` |
| contains_word | string | `field: contains: word: string` |
| contains_similar_word | string | `field: contains: similar: word: string` |
| has_file_type | image/*document* | `field: file: type: image/*document*` |
| has_items_has | 1 | `field: items: has: 1` |
| length_is_equal_than | 1 | `field: length: is: equal: than: 1` |
| length_than | 100 | `field: length: than: 100` |
| length_than_or_equal | 100 | `field: length: than: or: equal: 100` |
| lower_than | 100 | `field: lower: than: 100` |
| lower_than_or_equal | 100 | `field: lower: than: or: equal: 100` |
| is_valid_and_article | true | `field: valid: and: article: true` |
| length_lower_or_equal | 1 | `field: 1` |
| length_lower_not_equal | 1 | `field: not: 1` |
| config_item_is_all_of | 1,5 | `field: all: of: 1,5` |
| config_item_is_none_of | 1,7 | `field: none: of: 1,7` |
| boolean | true | `field: true` |
| text_has_tag | 1 | `field: has: 1` |
| text_not_has_tag | 1 | `field: not: has: 1` |
| text_not_contains | string | `field: not: contains: string` |
| text_not_has_contains | string | `field: not: has: contains: string` |
| multiple_items_has | 1 | `field: has: 1` |
| multiple_items_has_not | 1 | `field: not: has: 1` |
| multiple_contains_first_has | 1 | `field: has: 1` |
| multiple_contains_first_has_not | 1 | `field: not: has: 1` |
| empty | 1 | `field: empty` |
| not_empty | 1 | `field: not: empty` |
| date_is | 1 | `field: is: 1` |
| char_is_not | 1 | `field: not: is: 1` |

## HTTP Errors

| Error code | Status | Description |
|------------|--------|-------------|
| 400 | Bad Request | Request completed successfully |
| 401 | Unauthorized | The request contains invalid credentials or the API key is not present |
| 403 | Forbidden | Write key is inactive or application without valid subscription token |
| 404 | Not Found | No or invalid url found |
| 413 | Request Entity Too Large | The request exceeded the maximum allowed uploaded size |
| 422 | Unvalid length/size | The upload size/length of unexpected condition |
| 429 | Rate problems | Resource is waiting due to unacceptable request to categories |
| 500 | Service unavailable | The server could not process your request at time |
```

Request Example:

axios({
  method: "GET",
  url: "https://showcase.newhideaway.com/api/database/rows/table/736/?user_field_names=true",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN"
  }
})


Response Example:

{
    "count": 1024,
    "next": "https://showcase.newhideaway.com/api/database/rows/table/736/?page=2",
    "previous": null,
    "results": [
        {
            "id": 0,
            "order": "1.00000000000000000000",
            "ID": "1",
            "linkedtable": [
                {
                    "id": 0,
                    "value": "string"
                }
            ],
            "Image": [
                {
                    "url": "https://files.baserow.io/user_files/VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
                    "thumbnails": {
                        "tiny": {
                            "url": "https://files.baserow.io/media/thumbnails/tiny/VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
                            "width": 21,
                            "height": 21
                        },
                        "small": {
                            "url": "https://files.baserow.io/media/thumbnails/small/VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
                            "width": 48,
                            "height": 48
                        }
                    },
                    "name": "VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
                    "size": 229940,
                    "mime_type": "image/png",
                    "is_image": true,
                    "image_width": 1280,
                    "image_height": 585,
                    "uploaded_at": "2020-11-17T12:16:10.035234+00:00"
                }
            ],
            "button 1 text": "string",
            "button 2 text": "string",
            "button 3 text": "string",
            "button1": true,
            "button2": true,
            "button3": true,
            "Send-Date": "2020-01-01T12:00:00Z",
            "Posted": true,
            "character": [
                {
                    "id": 0,
                    "value": "string"
                }
            ],
            "avatar": [
                {
                    "url": "https://files.baserow.io/user_files/VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
                    "thumbnails": {
                        "tiny": {
                            "url": "https://files.baserow.io/media/thumbnails/tiny/VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
                            "width": 21,
                            "height": 21
                        },
                        "small": {
                            "url": "https://files.baserow.io/media/thumbnails/small/VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
                            "width": 48,
                            "height": 48
                        }
                    },
                    "name": "VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
                    "size": 229940,
                    "mime_type": "image/png",
                    "is_image": true,
                    "image_width": 1280,
                    "image_height": 585,
                    "uploaded_at": "2020-11-17T12:16:10.035234+00:00"
                }
            ],
            "message": "string",
            "msgType": {
                "id": 1,
                "value": "Option",
                "color": "light-blue"
            }
        }
    ]
}