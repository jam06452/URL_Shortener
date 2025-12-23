from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import RedirectResponse
import backend

app = FastAPI()

class encode(BaseModel):
    encode: str

class decode(BaseModel):
    decode: str


@app.post("/make_url")
def make(data: encode):
    return backend.encoder(data.encode)

@app.get("/{short_url}")
def redirect(short_url: str):
    return RedirectResponse(backend.decoder(short_url))