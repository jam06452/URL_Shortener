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

## Optimizations
- Added Prewarming redirect caching to improve times from 5ms to 150µs
- Instead of directing my backend to the supabase backend via cloudflare (supabase.jam06452.uk), I changed it for the interal machine address
- Instead of writing directly to database syncronosly, I changed it to use async to run it in the backround for time improvements from 150ms to 5ms
- Use of Cachex.fetch!() to see if the redirect was in the cache already, if it was not, it gets it from the database and puts it in cache

## Tech stack
- Supabase for DB
- Cachex for caching within Elixir
- Elixir & Phoenix for backend APIs

## Deployment
- Free Oracle VM for backend & frontend
- Both use GitHub actions for auto deployment on main branch

## AI Generated Files
- Frontend
- Dockerfile for elixir
