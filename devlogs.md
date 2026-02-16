### Devlog 1: MVP in Python

I’ve started a new project to handle URL shortening. I wanted something lightweight, so I spun up a **FastAPI** application in Python. For the MVP (minimum viable product), I didn't want to mess with a complicated database, so I opted for a simple JSON file (`db.json`) to act as the persistence layer.

The core logic is pretty straightforward. I implemented a hashing algorithm using `zlib.crc32` to generate a checksum of the URL, and then converted that integer into a Base36 string (0-9, a-z). This gives us those nice, short alphanumeric codes.

Currently, the `encoder` function checks if the URL already exists in our JSON "database" to avoid duplicates. If it’s new, it hashes it, saves the pair, and returns the short code. The `decoder` just does a dictionary lookup. It’s dirty, but it works for `localhost`.

This only works with direct API calling, I am going to add a frontend later on even if it is just html & CSS.

**Commits**

- Commit `c815299`: Initial API endpoints and working backends

---

### Devlog 2: Moving to Supabase

The JSON file storage was obviously not going to scale past a single user, so I’ve migrated the persistence layer to **Supabase**.

I created a new module `db.py` to handle the interactions. I'm using the `supabase` Python client to perform basic CRUD operations. Now, instead of reading a file, `read_encode` and `read_decode` query a `URL_Shortener` table. This allows the API to be stateless, which is a requirement if I ever want to deploy this to a cloud provider.

I also added an `.env` file to handle the API keys securely, though I admit I hardcoded them in the first commit just to get it working. Don't try using my keys, already rotated them.

**Commits**

- Commit `93f5730`: Using Supabase, instead of .json
---

### Devlog 3: Using Docker

To make deployment easier and ensure my development environment matches production, I have containerized the application.

I wrote a `Dockerfile` based on `python:3.11-slim`. One big optimisation I add during the build stage was using a mount cache for pip: `RUN --mount=type=cache,target=/root/.cache/pip`. This speeds up the build process significantly by caching downloaded packages between builds so I’m not re-downloading FastAPI every time I change a line of code.

I also added a `.dockerignore` to keep the image clean (no `__pycache__` or `.git` folders inside the container).

**Commits**

- Commit `2173f33`: Added better docker practices, cache pip etc
---

### Devlog 4: Restructuring of Folders & Basic Frontend

The root directory was getting cluttered, so I’ve restructured the project. I moved the API code into a `Backend/` directory and created a `Frontend/` directory.

I realized I needed a way to actually interact with this besides `curl`, so I built a very basic HTML/JS frontend. It’s nothing fancy just an input box and a fetch call.

However, this introduced the CORS (Cross-Origin Resource Sharing) errors. The frontend (running on one port) tried to talk to the backend (on another), and the browser blocked it. I had to add `CORSMiddleware` to the FastAPI app to explicitly allow these requests.

**Commits**

- Commit `45c97ef`: Added basic frontend
---

### Devlog 5: Improving UX (User Expierence)

I did some work on the frontend today. Previously, when you shortened a URL, it just gave you the text. I updated the JavaScript to create a clickable link.

Even better, I implemented a "Click to Copy" feature. I used the `navigator.clipboard.writeText()` API so that when a user clicks the shortened link, it copies it directly to their clipboard and briefly changes the link text to "Copied!". It feels much snappier now.

I also extracted the API URL into a `config.js` file. This is crucial because `localhost` won't be the URL forever, and I don't want to hunt through `main.js` to change it later.

**Commits**

- Commit `cfe61b7`: Copies instead of following through on returned URL on front
---

### Devlog 6: Tracking Clicks

On the backend, I added a `click` function in `db.py` that calls a Postgres RPC (Remote Procedure Call) named `click_counter`. This is a stored procedure in Supabase that atomically increments the click count for a given URL. This is much safer than reading the count, adding one, and writing it back, which would be prone to race conditions under load.

I also exposed a new endpoint `GET /clicks/{encoded}` so users can retrieve these stats.

**Commits**

- Commit `12062b6`: Added Click Counter
    
- Commit `47e20e9`: Added API for calling click count
---

### Devlog 7: Preparing & Deploying to Prod
I’m getting ready to deploy. I ran into a port conflict where Supabase local development and my Docker container were fighting for port 8080, so I bumped the container to 8081.

I also refactored the API routes. I added a `/url_shortener` prefix to all endpoints. This is often necessary when running behind a reverse proxy (like Nginx or Cloudflare) where you might have multiple apps running on the same domain under different paths.

I also tightened up the CORS settings to only allow my specific production domain (`https://url.jam06452.uk`) rather than the wildcard `*` I used previously.

**Commits**

- Commit `cea6387`: Port 8080 -> 8081, port conflicts with supabase
    
- Commit `af343b5`: Removed api serving frontend, added /url_shortener prefix

---

### Devlog 8: Cloudflare Redirect Issues

I ran into an issue with Cloudflare Pages. Since the frontend is a Single Page App (SPA), handling the redirection logic (e.g., `url.jam06452.uk/abcd` -> `google.com`) was tricky.

I wrote a Cloudflare Function (`functions/[[path]].js`) to handle this. It acts as a middleware.

The key fix was handling the 302 redirect manually. By default, `fetch` in the worker follows redirects transparently. I had to set `redirect: "manual"`. This allows the worker to capture the 302 response from my backend and pass that 302 _back_ to the browser, causing the user to actually redirect.

**Commits**

- Commit `12825e9`: Updated CF Redirects, this fixes issue from last deployment

---

### Devlog 9: Elixir Migration

I decided to rewrite the entire backend in **Elixir** using the **Phoenix** framework.

Why? Concurrency and fault tolerance. Python is great, but Elixir’s BEAM VM is built for systems that need to handle many small, independent requests (like URL redirects) reliably.

I initialized a new Phoenix project `exapi`. I set up the initial routing structure and recreated the `make_url` and redirection logic. It’s a bit more verbose than FastAPI initially, but the pattern matching features for handling database results (`{:ok, result}` vs `{:error, reason}`) make the code much more robust.

**Commits**

- Commit `d25ec93`: Migration to elixir, works so far
---

### Devlog 10: Dropping Ecto for Speed


I started out using **Ecto** (Elixir's standard database wrapper), but it felt like overkill since I'm just making simple REST calls to Supabase anyway.

I stripped out Ecto and switched to using the `supabase-potion` library directly. This makes the codebase significantly lighter. I’m manually constructing the API calls to PostgREST.

I also updated the `Dockerfile` for the Elixir app. Elixir builds are a bit different you have to compile the release inside the build stage and then copy the binary to a runner image. This results in a super small, production-ready image without the Erlang compiler overhead.

**Commits**

- Commit `737e851`: Removed ecto for in favour of supabase
    
- Commit `dde8505`: Removed ecto and added working docker

---

### Devlog 11: Multi-Architecture Builds


I want to run this on my Oracle cloud server (ARM64).

I set up a GitHub Actions workflow that uses `docker buildx`. It builds the Elixir image for both `linux/amd64` and `linux/arm64` simultaneously and pushes them to the GitHub Container Registry.

My  strategy in the YAML file was to spin up different runners for each architecture to speed up the build process, then merges the manifests at the end. Now `docker pull` just works regardless of the hardware.

**Commits**

- Commit `389e630`: Initial multi platform image maker
    

---

### Devlog 12: Implementing Caching


Database calls are expensive. To speed up redirects, I integrated **Cachex**, an Elixir caching library.

I modified the `decode` function in `backend.ex`. The logic is now:

1. Check Cachex.
2. If it's a hit, return the URL immediately.
3. If it's a miss, query Supabase, store the result in Cachex, and then return it.

This lowered the redirection time from ~50ms (network trip to Supabase) to sub-millisecond speeds for frequently accessed URLs. 

Another way I optimized the speed was that I was sending requests to my local supabase instance via cloudflare instead of locally. This significantly sped up requests along side with the caching.

**Commits**

- Commit `fd19c3b`: Initial cache setup tranfer
---

### Devlog 13: Proper Frontend

I got bored of the standard html & CSS. I’ve completely redesigned the frontend with help from claude.

The House style is:

- Pure black background (`#000000`).
    
- Neon Cyan, Magenta, and Yellow accents.
    
- Hard edges (0px border-radius).
    
- Offset, solid shadows.
    
- Monospace fonts

It took me ages even with claude since I had to learn more about web dev instead of just html & JS. 

**Commits**

- Commit `1e50529`: Added complete Frontend
---

### Devlog 14: Validating URLs

I noticed people were shortening broken links. I updated the frontend `main.js` to validate the URL before sending it to the API.

It does a `HEAD` request (ping) to the target URL. If the fetch fails (or times out after 5 seconds), we know the site is unreachable.

However, sometimes you _want_ to shorten a "fake" or unreachable URL (maybe for a local network). So, instead of blocking it completely, I added a logic branch: if the ping fails, the UI asks, "Site unreachable. Send as text instead?" If they agree, we flag it as a message in the database. 

Messages can also be sent by just writing a sentance in the box. It tags messages with `~` at the end for the backend to go to the correct table within supabase.

**Commits**

- Commit `6d90c30`: Site validation
    
- Commit `9b9def2`: If url is not real, asks user if send as message

---

### Devlog 15: Final Polish & cleanup

Done some final housekeeping. I removed the old Python backend files entirely to keep the repo clean. The `Backend - Python` folder is gone.

I also improved the error logging in the frontend. If the API returns a 500 or a custom error message, we now parse the JSON response and display the specific error to the user (e.g., "Server says: Invalid URL format") rather than a generic "Error".

The project feels complete now. It’s fast (Elixir + Caching), looks unique, and robust (Docker + Cloudflare).

**Commits**

- Commit `13cd00b`: Removed unnessarcy file
    
- Commit `b5eb13b`: Indepth frontend logging
