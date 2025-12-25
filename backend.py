import zlib
#db is seperate script for handling supabase operations
import db

#Encodes the string
#Input -> sanitize -> hash function -> output
def encoder(decoded):
        if not (decoded.startswith("https://") or decoded.startswith("http://")):
            decoded = f"https://{decoded}"
        exist = db.read_encode(decoded)

        if exist is not None:
             return exist
        else:
            encoded = gen_hash(decoded)
            db.save(encoded, decoded)
            return encoded

#Searches for hash in DB
#Checks if it exists, if true returns it, if false returns None
def decoder(encoded):
    #Reduces DB searches from 2 to 1 by making it a var instead of calling twice
    exist = db.read_decode(encoded)

    if exist:
        return exist
    else:
        return None

#Input -> Shortened Hashed Output
def gen_hash(decoded):
    number = zlib.crc32(decoded.encode())
    #base36, URLs do not need capital letters, support maybe added for other chars in the future
    alph = "0123456789abcdefghijklmnopqrstuvwxyz"

    chars = []
    if number == 0:
        return alph[0]
    
    #Hash Function
    while number > 0:
        number, remainder = divmod(number, 36)
        char = alph[remainder]
        chars.append(char)
    #Hash is reversed since the way it was hashed, have to reverse it for it to be the right way around.
    #Basic Example: 12345 -> 54321 makes sense if it is reversed back to 12345
    encoded = "".join(reversed(chars))
    
    return encoded