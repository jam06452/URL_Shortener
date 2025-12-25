from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
#backend is a seperate script for processing
import backend

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#API for generating an encoded string from an URL with POST requests.
@app.post("/make_url")
def make(url: str):
    return backend.encoder(url.lower())

#This redirects to the real website when you enter an encoded string after the url. "https://lh/encoded_string"
#Keep /{short_url} at the end 
@app.get("/{encoded}")
def redirect(encoded: str):
    url = backend.decoder(encoded)
    if url is not None:
        return RedirectResponse(url)
    else:
        raise HTTPException(status_code=404, detail="URL not found")
