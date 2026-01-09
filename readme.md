# URL Shortener

A simple and efficient URL shortener service built with **Elixir (Phoenix)** and JavaScript. It features URL shortening, redirection, and click tracking.

## AI Generated Files
- Frontend
- Readme
- Elixir Dockerfile

## 🚀 Features

- **Shorten URLs**: Convert long URLs into compact, shareable links.
- **Redirection**: Automatically redirects short codes to their original destinations.
- **Click Tracking**: Monitor how many times a short link has been visited.
- **Edge Routing**: Uses Cloudflare Pages Functions for low-latency routing.

## 🛠️ Tech Stack

- **Backend**: Elixir (Phoenix)
- **Database**: Supabase
- **Frontend**: HTML, JavaScript
- **Deployment**: Cloudflare Pages (Frontend & Functions), Docker (Elixir releases)

## 📂 Project Structure

- `exapi/`: **Elixir/Phoenix** application that implements the URL-shortening API and routing.
- `Frontend/`: Static web assets for the user interface.
- `functions/`: Cloudflare Pages Functions for handling routing and proxying requests.

## 🔌 API Endpoints

Base URL: `https://api.jam06452.uk` (or `http://localhost:8000` for local dev)

### 1. Shorten URL
Create a new short link.

- **Endpoint**: `POST /url_shortener/make_url`
- **Query Parameter**: `url` (string) - The URL to shorten.
- **Response**: JSON object containing the original URL and the short code.

### 2. Get Clicks
Retrieve the click count for a short link.

- **Endpoint**: `GET /url_shortener/clicks/{encoded}`
- **Path Parameter**: `encoded` (string) - The short code.
- **Response**: JSON object with the click count.

### 3. Redirect
Redirect to the original URL.

- **Endpoint**: `GET /url_shortener/{encoded}`
- **Path Parameter**: `encoded` (string) - The short code.
- **Response**: `307 Temporary Redirect`

## 💻 Local Setup

### Backend (Elixir / Phoenix)

1. Navigate to the `exapi` directory:
   ```bash
   cd exapi
   ```
2. Install dependencies and setup the app:
   ```bash
   mix deps.get
   mix setup
   ```
3. Set environment variables for Supabase (e.g., `SUPABASE_ADDRESS`, `SUPABASE_KEY`).
4. Run the server locally:
   ```bash
   mix phx.server
   ```

### Frontend

1. Navigate to the `Frontend` directory.
2. Open `index.html` in your browser or serve it using a local server (e.g., Live Server).

## ☁️ Deployment

- **Frontend**: Deployed to Cloudflare Pages.
- **Backend**: Containerized using Docker and deployed locally.

## ⚡ Performance & Optimizations

After migrating the backend from Python to **Elixir (Phoenix)**, the service saw substantial latency improvements due to the BEAM's concurrency model, lightweight processes, and non-blocking I/O. Key changes and their impact:

- **Async DB writes & caching**: I use asynchronous background tasks for DB persistence and Cachex for read caching which reduces blocking on hot paths (reads served from cache instead of database).
- **Optimized DB access**: Connection pooling (Postgrex / PgBouncer), prepared statements, and proper indexing on the `encoded` column reduce request time to Supabase/Postgres.
- **Small, deterministic redirect path**: The redirect code path avoids heavy computation and unnecessary I/O where possible, minimizing latency.

Measured (representative) performance:

- **Redirects (avg)**: ~152 µs (microseconds)
- **Initial encoding (avg)**: ~15 ms (milliseconds)


## Roadmap

- Pings to ensure websites are real