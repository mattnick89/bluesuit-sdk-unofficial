# BlueSuit SDK - Unofficial

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install bluesuit-sdk-unofficial.

```bash
npm install bluesuit-sdk-unofficial
```

## Initializing

```typescript
import { BlueSuitSDK } from "bluesuit-sdk-unofficial";

const bluesuit = new BlueSuitSDK("<api-key>");

```

## Processing Documents

### Processing Options
```typescript
let processing_options = {
    "document_path": "string | buffer",
    "document_type": "string",
    "processing_type": "string",
    "options": {
        "email": "string[]",
        "tag": "string"
    }
}
```
**document_path**: Pass a file path to a pdf, a url to a hosted pdf file, or a binary stream of a pdf file.

**document_type**: (Accepted values)
  - closing_disclosure
  - property_deed
  - rent_roll
  - purchase_sale_agreement
  - offering_memo

**processing_type**: (Accepted values)
  - accurate
  - quick
  - foundational

**options.email**: (Optional) An array of one or more email addresses. When the request completes successfully (or errors out), any email addresses included will receive an email with the status update for the document extraction. 

**options.tag**: (Optional) This will associate the request with a tag in our system. When used in conjunction with a valid value for the email query string parameter, the tag data will show up in the file names of the attached results.

```typescript
import { BlueSuitSDK } from "bluesuit-sdk-unofficial";

const bluesuit = new BlueSuitSDK("<api-key>");

async function do_processing() {
    let processing_options = {
        document_path: "/path/to/filename.pdf",
        document_type: "closing_disclosure",
        processing_type: "quick",
        options: {
            email: ["me@example.com"],
            tag: "DOC_2022"
        }
    }
    const response = await bluesuit.processDocument(processing_options);
    console.log(response);
}

do_processing();
/*
    {
        "message": "Accepted",
        "requestId": "XXX-XXX-XXX"
    }
*/
```



## Check Status

```typescript
import { BlueSuitSDK } from "bluesuit-sdk-unofficial";

const bluesuit = new BlueSuitSDK("<api-key>");

async function check_status() {
    let requestId = "XXX-XXX-XXX";
    const response = await bluesuit.checkStatus(requestId);
    console.log(response);
}

check_status();
/*
{
  "message": "Found",
  "requestId": "XXX-XXX-XXX"
}
*/
```