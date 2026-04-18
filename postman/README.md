# Postman Collection

## Files

- `School_Management_API.postman_collection.json` - All requests with test scripts
- `School_Management_API_Local.postman_environment.json` - For local development
- `School_Management_API_Production.postman_environment.json` - For the hosted API

## How to Import

1. Open Postman
2. Click **Import**
3. Select the collection file and one of the environment files
4. Choose the environment from the dropdown in the top-right corner

## Requests

**Health Check**
- `GET /health`

**Add School**
- `POST /addSchool` - Success case
- `POST /addSchool` - Missing name
- `POST /addSchool` - Missing all fields
- `POST /addSchool` - Invalid coordinates

**List Schools**
- `GET /listSchools?latitude=28.6139&longitude=77.2090` - Near New Delhi
- `GET /listSchools?latitude=19.0760&longitude=72.8777` - Near Mumbai
- `GET /listSchools` - Missing parameters
- `GET /listSchools?latitude=abc&longitude=72.8777` - Invalid latitude
- `GET /unknown` - 404 unknown route
