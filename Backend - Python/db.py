from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

#Using .env for prod
URL = os.getenv("SUPABASE_ADDRESS")
KEY = os.getenv("SUPABASE_KEY")

if not URL or not KEY:
    raise ValueError("SUPABASE_ADDRESS or SUPABASE_KEY are missing")

#Using Constant for SUPABASE creds since it will never be changed by the script. Used multiple times
SUPABASE: Client = create_client(URL, KEY)

def save(encoded, decoded):
    #Date is handled by supabase incase the script is ran in a different timezone by accident
    data = {"Encoded": encoded, "Decoded": decoded}
    response = SUPABASE.table("URL_Shortener").insert(data).execute()

    return response

#Returns an encoded string from an entire url
def read_encode(decoded):
    response = SUPABASE.table("URL_Shortener").select("Encoded").eq("Decoded", decoded).execute()
    
    if response.data:
        return response.data[0]["Encoded"]
    else:
        return None

#Returns an decoded url from an entire encoded string
def read_decode(encoded):
    response = SUPABASE.table("URL_Shortener").select("Decoded").eq("Encoded", encoded).execute()

    if response.data:
        return response.data[0]["Decoded"]
    else:
        return None
    
def click(encoded):
    SUPABASE.rpc("click_counter", {"encoded_input": encoded}).execute()

def get_clicks(encoded):
    response = SUPABASE.table("URL_Shortener").select("Clicks").eq("Encoded", encoded).execute()

    if response.data != []:
        return response.data[0]["Clicks"]
    else:
        return None