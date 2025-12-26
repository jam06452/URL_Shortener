from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
#backend is a seperate script for processing
import backend

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://url.jam06452.uk", "http://url.jam06452.uk"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"Status": "Healthy"}

#API for generating an encoded string from an URL with POST requests.
@app.post("/make_url")
def make(url: str):
    return {url: backend.encoder(url.lower())}

# API for getting the amount of times a link was clicked
@app.get("/clicks/{encoded}")
def get_clicks(encoded: str):
    clicks = backend.db.get_clicks(encoded)
    #Checking for null does not work, backend returns None which gets converted to null when returned to front
    if clicks is not None:
        return {"Clicks": clicks}
    else:
        return {"Clicks": "Not Found"}

#This redirects to the real website when you enter an encoded string after the url. "https://lh/encoded_string"
#Keep /{short_url} at the end 
@app.get("/{encoded}")
def redirect(encoded: str):
    url = backend.decoder(encoded)
    if url is not None:
        backend.db.click(encoded)
        return RedirectResponse(url)
    else:
        raise HTTPException(status_code=404, detail="URL not found")
