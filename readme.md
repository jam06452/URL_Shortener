# URL Shortener API Documentation
## AI Generated code
- readme.md
- frontend

## Overview
This API provides a simple service to shorten URLs using a Base36 encoding algorithm. It is built with FastAPI and uses Supabase as the backend database.

## Base URL
`http://localhost:8080` (Local)

## Endpoints

### 1. Create Short URL
Generates a short code for a given long URL.

- **URL**: `/make_url`
- **Method**: `POST`
- **Query Parameter**: `url` (string) - The long URL to shorten.
- **Response**: `string` (The generated short code)

**Example:**
```bash
curl -X POST "http://localhost:8080/make_url?url=https://google.com"
# Output: "1z5a"
```

### 2. Redirect
Redirects a short code to its original long URL.

- **URL**: `/{encoded}`
- **Method**: `GET`
- **Path Parameter**: `encoded` (string) - The short code.
- **Response**: `307 Temporary Redirect` to the original URL.
- **Error**: Returns 404 error if the code does not exist.


## Road map

- Adding pings to ensure websites are real