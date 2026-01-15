# URL_Shortener


## API Endpoints

### POST - /make_url
- Requires the destination address in the body
- Returns the shortened code ONLY

### GET - /:encoded
- Pass the shortened code at root ("/"), 
- redirects via a 302 to the target site
- If a message, returns the message as a json pair
### GET - /clicks/:encoded
- Pass the shortened code
- Returns the amount of clicks for that specific code.

## Setup
```bash
cd exapi

export SUPABASE_ADDRESS="Your Address"
export SUPABASE_KEY="Your Key"

# To get a secret key run the command below
mix phx.gen.secret
export SECRET_KEY_BASE="Secret Key"

mix phx.server
```
- Update config.js to point to the new backend
- If local dev, point to "http://localhost:4000"

## Performance
- Initial encoding takes approximately ~ 15 milliseconds, after verification of the URL
- Redirects take approximately ~ 150 microseconds.
## Tech stack
- Supabase for DB
- Cachex for caching within Elixir
- Elixir & Phoenix for backend APIs

## Deployment
- Cloudflare Pages for frontend
- Free Oracle VM for backend
- Both use GitHub actions for auto deployment on main branch

## AI Generated Files
- Frontend
- Dockerfile for elixir
