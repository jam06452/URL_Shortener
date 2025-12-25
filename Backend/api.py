from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
#backend is a seperate script for processing
import backend

app = FastAPI()

#API for generating an encoded string from an URL with POST requests.
@app.post("/make_url")
def make(url: str):
    return backend.encoder(url.lower())

#Remove this on production branch, just for testing
@app.get("/make/{decoded:path}")
def getmake(decoded: str):
    return backend.encoder(decoded.lower())

#This redirects to the real website when you enter an encoded string after the url. "https://lh/encoded_string"
#Keep /{short_url} at the end 
@app.get("/{encoded}")
def redirect(encoded: str):
    url = backend.decoder(encoded)
    if url is not None:
        return RedirectResponse(url)
    else:
        raise HTTPException(status_code=404, detail="URL not found")