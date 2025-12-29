# URL Shortener

A simple and efficient URL shortener service built with Python (FastAPI) and JavaScript. It features URL shortening, redirection, and click tracking.

## AI Generated Files
- readme.md
- Fronted & functions
- Elixir Dockerfiles

## 🚀 Features

- **Shorten URLs**: Convert long URLs into compact, shareable links.
- **Redirection**: Automatically redirects short codes to their original destinations.
- **Click Tracking**: Monitor how many times a short link has been visited.
- **Edge Routing**: Uses Cloudflare Pages Functions for low-latency routing.

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python)
- **Database**: Supabase
- **Frontend**: HTML, JavaScript
- **Deployment**: Cloudflare Pages (Frontend & Functions), Docker (Backend)

## 📂 Project Structure

- `Backend/`: Contains the FastAPI application, database logic, and Docker configuration.
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

### Backend

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables (create a `.env` file with Supabase credentials).
4. Run the server:
   ```bash
   uvicorn api:app --reload
   ```

### Frontend

1. Navigate to the `Frontend` directory.
2. Open `index.html` in your browser or serve it using a local server (e.g., Live Server).

## ☁️ Deployment

- **Frontend**: Deployed to Cloudflare Pages.
- **Backend**: Containerized using Docker and deployed locally.

## Roadmap

- Pings to ensure websites are real
- Redis caching for the most used addresses