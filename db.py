from supabase import create_client, Client

url = "http://localhost:8000"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q"

SUPABASE: Client = create_client(url, key)

def save(encoded, decoded):
    global SUPABASE

    data = {"Encoded": encoded, "Decoded": decoded}
    response = SUPABASE.table("URL_Shortener").insert(data).execute()

    return response


def read_encode(decoded):
    global SUPABASE

    response = SUPABASE.table("URL_Shortener").select("Encoded").eq("Decoded", decoded).execute()
    
    if response.data:
        return response.data[0]["Encoded"]
    else:
        return None

def read_decode(encoded):
    global SUPABASE

    response = SUPABASE.table("URL_Shortener").select("Decoded").eq("Encoded", encoded).execute()

    if response.data:
        return response.data[0]["Decoded"]
    else:
        return None


    
    