# security
This file is about anything related to security.

## attacks
I should read up about things such as xss and sql injection.

## storage
The data is stored in the browser's local storage. If the json file is not
synced with the server, it is not encrypted. Once the client communicates with
the server, the json file is encrypted using AES256 (or similar) and a key
derived from the password (eg. using pbkdf2).
