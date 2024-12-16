# MascotMessenger Database API Documentation

## Introduction

The MascotMessenger database provides an easy way to integrate the data with any external system. The API follows REST semantics, uses JSON to encode objects and relies on standard HTTP codes, machine and human readable errors to signal operation outcomes.

Database ID: `117`

## Authentication

Baserow uses token-based authentication. You need to generate a database token to use the endpoints. Authentication is done by providing your token in the HTTP authorization bearer token header.

Request Example:

```javascript
axios({
  url: "https://showcase.newhideaway.com",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN"
  }
})
```

## Tables

### Messages Table (id: 787)

#### Fields

| Field ID | Name | Type | Description |
|----------|------|------|-------------|
| field_6527 | ID | autonumber | Auto-incrementing identifier (read-only) |
| field_6529 | characterlink | array | Links to characters table |
| field_6531 | avatar | array | Avatar image (read-only lookup field) |
| field_6532 | message | string | Message content |
| field_6533 | msgType | integer/string | Message type (secret/system) |
| field_6534 | Image | array | Message image attachments |
| field_6535 | Send-Date | date | Accepts a date in ISO format |
| field_6536 | Posted | boolean | Message posted status |
| field_6537 | button1 | boolean | First button enabled |
| field_6538 | button 1 text | string | First button text |
| field_6539 | button2 | boolean | Second button enabled |
| field_6540 | button 2 text | string | Second button text |
| field_6541 | button3 | boolean | Third button enabled |
| field_6542 | button 3 text | string | Third button text |
| field_6550 | nickname | array | Character nickname (lookup field) |

#### Message Type Options
- ID: 4753 - "secret" 
- ID: 4754 - "system" 

#### Endpoints

##### List Messages
GET /api/database/rows/table/787/

##### Get Single Message
GET /api/database/rows/table/787/{row_id}/

##### Create Message
POST /api/database/rows/table/787/

##### Update Message
PATCH /api/database/rows/table/787/{row_id}/

##### Delete Message
DELETE /api/database/rows/table/787/{row_id}/

### Characters Table (id: 788)

#### Fields

| Field ID | Name | Type | Description |
|----------|------|------|-------------|
| field_6543 | name | string | Character name |
| field_6545 | avatar | array | Character avatar image |
| field_6546 | Messages Count | array | Count of messages (lookup) |
| field_6547 | messages | integer | Message count |
| field_6548 | messages - linkedtable | array | Linked messages |
| field_6549 | nickname | string | Character nickname |

#### Endpoints

##### List Characters
GET /api/database/rows/table/788/

##### Get Single Character
GET /api/database/rows/table/788/{row_id}/

##### Create Character
POST /api/database/rows/table/788/

##### Update Character
PATCH /api/database/rows/table/788/{row_id}/

##### Delete Character
DELETE /api/database/rows/table/788/{row_id}/

## File Uploads

### Upload File
POST /api/user-files/upload-file/
Uploads file directly via multipart form data

### Upload File via URL
POST /api/user-files/upload-via-url/
Uploads file from provided URL



List Fields 

Request Example:
```javascript
axios({
  method: "GET",
  url: "https://showcase.newhideaway.com/api/database/fields/table/787/",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN"
  }
})
``` 
Response Example:

```json
[
    {
        "id": 6527,
        "table_id": 787,
        "name": "ID",
        "order": 0,
        "type": "autonumber",
        "primary": true,
        "read_only": true,
        "description": "A sample description"
    },
    {
        "id": 6529,
        "table_id": 787,
        "name": "characterlink",
        "order": 2,
        "type": "link_row",
        "primary": false,
        "read_only": false,
        "description": "A sample description"
    },
    {
        "id": 6531,
        "table_id": 787,
        "name": "avatar",
        "order": 4,
        "type": "lookup",
        "primary": false,
        "read_only": true,
        "description": "A sample description"
    }
]
```

List Rows

Request Example:
```javascript
axios({
  method: "GET",
  url: "https://showcase.newhideaway.com/api/database/rows/table/787/?user_field_names=true",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN"
  }
})
```

Response Example:

```json
{
    "count": 1024,
    "next": "https://showcase.newhideaway.com/api/database/rows/table/787/?page=2",
    "previous": null,
    "results": [
        {
            "id": 0,
            "order": "1.00000000000000000000",
            "ID": "1",
            "characterlink": [
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
            },
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
            "Send-Date": "string",
            "Posted": true,
            "button1": true,
            "button 1 text": "string",
            "button2": true,
            "button 2 text": "string",
            "button3": true,
            "button 3 text": "string",
            "nickname": [
                {
                    "id": 0,
                    "value": "string"
                }
            ]
        }
    ]
}   
```

Create Message

Request Example:
```javascript
axios({
  method: "POST",
  url: "https://showcase.newhideaway.com/api/database/rows/table/787/?user_field_names=true",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN",
    "Content-Type": "application/json"
  },
  data: {
    "characterlink": [1],
    "message": "string",
    "msgType": 1,
    "Image": [{
      "name": "VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png"
    }],
    "Send-Date": "string",
    "Posted": true,
    "button1": true,
    "button 1 text": "string",
    "button2": true,
    "button 2 text": "string",
    "button3": true,
    "button 3 text": "string"
  }
})
```

Update Message

Request Example:
```javascript
axios({
  method: "PATCH",
  url: "https://showcase.newhideaway.com/api/database/rows/table/787/{row_id}/?user_field_names=true",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN",
    "Content-Type": "application/json"
  },
  data: {
    "message": "Updated message",
    "Posted": true
  }
})
```

Delete Message

Request Example:
```javascript
axios({
  method: "DELETE",
  url: "https://showcase.newhideaway.com/api/database/rows/table/787/{row_id}/",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN"
  }
})
```

Get Single Character

Request Example:
```javascript
axios({
  method: "GET",
  url: "https://showcase.newhideaway.com/api/database/rows/table/788/{row_id}/?user_field_names=true",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN"
  }
})
```

Response Example:
```json
{
    "id": 0,
    "order": "1.00000000000000000000",
    "name": "string",
    "avatar": [
        {
            "url": "https://files.baserow.io/user_files/example.png",
            "thumbnails": {
                "tiny": {
                    "url": "https://files.baserow.io/media/thumbnails/tiny/example.png",
                    "width": 21,
                    "height": 21
                },
                "small": {
                    "url": "https://files.baserow.io/media/thumbnails/small/example.png",
                    "width": 48,
                    "height": 48
                }
            },
            "name": "example.png",
            "size": 229940,
            "mime_type": "image/png",
            "is_image": true,
            "image_width": 1280,
            "image_height": 585,
            "uploaded_at": "2020-11-17T12:16:10.035234+00:00"
        }
    ],
    "Messages Count": [
        {
            "id": 0,
            "value": 0
        }
    ],
    "messages": 0,
    "messages - linkedtable": [
        {
            "id": 0,
            "value": "string"
        }
    ],
    "nickname": "string"
}
```

Create Character

Request Example:
```javascript
axios({
  method: "POST",
  url: "https://showcase.newhideaway.com/api/database/rows/table/788/?user_field_names=true",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN",
    "Content-Type": "application/json"
  },
  data: {
    "name": "string",
    "avatar": [{
      "name": "example.png"
    }],
    "messages - linkedtable": [1],
    "nickname": "string"
  }
})
```

File Upload Examples

Direct File Upload:
```javascript
const formData = new FormData();
formData.append('file', fileObject);

axios({
  method: "POST",
  url: "https://showcase.newhideaway.com/api/user-files/upload-file/",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN",
    "Content-Type": "multipart/form-data"
  },
  data: formData
})
```

Upload via URL:
```javascript
axios({
  method: "POST",
  url: "https://showcase.newhideaway.com/api/user-files/upload-via-url/",
  headers: {
    Authorization: "Token YOUR_DATABASE_TOKEN",
    "Content-Type": "application/json"
  },
  data: {
    "url": "https://baserow.io/assets/photo.png"
  }
})
```

Response Example for File Uploads:
```json
{
    "url": "https://files.baserow.io/user_files/example.png",
    "thumbnails": {
        "tiny": {"url": "https://files.baserow.io/media/thumbnails/tiny/example.png", "width": 21, "height": 21},
        "small": {"url": "https://files.baserow.io/media/thumbnails/small/example.png", "width": 48, "height": 48}
    },
    "name": "example.png",
    "size": 229940,
    "mime_type": "image/png",
    "is_image": true,
    "image_width": 1280,
    "image_height": 585,
    "uploaded_at": "2020-11-17T12:16:10.035234+00:00"
}
```


